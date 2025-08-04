document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("tts-form");
    const textInput = document.getElementById("text");
    const audioPlayer = document.getElementById("audio-player");
    const playerSection = document.getElementById("player-section");

    if (!form || !textInput || !audioPlayer || !playerSection) {
        console.error("❌ One or more elements not found in DOM.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const text = textInput.value;
        const formData = new FormData();
        formData.append("text", text);

        try {
            const response = await fetch("/generate-audio", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("✅ Response Data:", data);

            if (data.audio_url) {
                audioPlayer.src = data.audio_url;
                playerSection.style.display = "block";
            } else {
                alert("Failed to generate audio.");
            }
        } catch (err) {
            console.error("❌ Error:", err);
            alert("Something went wrong.");
        }
    });
});
