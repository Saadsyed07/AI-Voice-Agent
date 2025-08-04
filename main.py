import os
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv

from murf import Murf 

load_dotenv()

MURF_API_KEY = os.getenv("MURF_API_KEY")
if not MURF_API_KEY:
    raise RuntimeError("Missing MURF_API_KEY")

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def serve_home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/generate-audio")
async def generate_audio(text: str = Form(...)):
    try:
        client = Murf(api_key=MURF_API_KEY)  # Pass API key explicitly
        audio_res = client.text_to_speech.generate(
            text=text,
            voice_id="en-IN-Aarav"  # Use voice from documentation
        )
        return {"audio_url": audio_res.audio_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Murf SDK error: {str(e)}")
