// AI Voice Agent - Clean & Professional
document.addEventListener("DOMContentLoaded", () => {
    initNetworkBackground();
    initVoiceForm();
});

// Network Background Animation
function initNetworkBackground() {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let nodes = [];
    let connections = [];
    
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initNodes();
    }
    
    function initNodes() {
        nodes = [];
        const nodeCount = Math.floor((width * height) / 15000);
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 2
            });
        }
    }
    
    function updateNodes() {
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > width) node.vx = -node.vx;
            if (node.y < 0 || node.y > height) node.vy = -node.vy;
        });
    }
    
    function drawNodes() {
        ctx.fillStyle = 'rgba(102, 126, 234, 0.4)';
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function drawConnections() {
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120;
                    ctx.globalAlpha = opacity * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        updateNodes();
        drawConnections();
        drawNodes();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
}

// Voice Form Functionality
function initVoiceForm() {
    const form = document.getElementById("tts-form");
    const textInput = document.getElementById("text");
    const audioPlayer = document.getElementById("audio-player");
    const playerSection = document.getElementById("player-section");
    const generateBtn = document.getElementById("generate-btn");
    const btnText = generateBtn.querySelector(".btn-text");

    if (!form || !textInput || !audioPlayer || !playerSection) {
        console.error("❌ Required elements not found");
        return;
    }

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = textInput.value.trim();
        if (!text) {
            showNotification("Please enter some text", "warning");
            return;
        }

        // Show loading state
        generateBtn.classList.add("loading");
        btnText.textContent = "Generating...";

        const formData = new FormData();
        formData.append("text", text);

        try {
            const response = await fetch("/generate-audio", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.audio_url) {
                audioPlayer.src = data.audio_url;
                playerSection.classList.add("show");
                
                setTimeout(() => {
                    playerSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 200);
                
                showNotification("Audio generated successfully", "success");
            } else {
                throw new Error("No audio URL received");
            }
        } catch (err) {
            console.error("Error:", err);
            showNotification("Failed to generate audio", "error");
        } finally {
            generateBtn.classList.remove("loading");
            btnText.textContent = "Generate Voice";
        }
    });

    // Input enhancement
    textInput.addEventListener("input", (e) => {
        const hasText = e.target.value.trim().length > 0;
        generateBtn.style.opacity = hasText ? "1" : "0.7";
    });
}

// Simple notification system
function showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const colors = {
        info: "#667eea",
        success: "#10b981", 
        warning: "#f59e0b",
        error: "#ef4444"
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);