import os
import asyncio
import edge_tts
import re
import requests 
import random
import time
import base64 
import PyPDF2
import io
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, template_folder='Frontend', static_folder='Frontend')
CORS(app)

# --- CONFIG ---
gemini_keys = [os.getenv("GEMINI_API_KEY_1"), os.getenv("GEMINI_API_KEY_2")]
current_gemini_index = 0
VOICE = "en-US-AndrewMultilingualNeural" 

def configure_genai():
    global current_gemini_index
    if current_gemini_index < len(gemini_keys) and gemini_keys[current_gemini_index]:
        genai.configure(api_key=gemini_keys[current_gemini_index])
configure_genai()

# --- MODEL SETUP ---
MODEL_NAME = 'gemini-2.5-flash-lite'
model = genai.GenerativeModel(
    MODEL_NAME,
    system_instruction="""You are Gimi AI.
    
    RULES:
    1. Be concise and straight to the point.
    2. Do NOT use "Part 1" labels.
    3. Audio summary (Part 2) must be short & NO Emojis.
    4. IDENTITY RULE: If asked "Who created you?" or "Kisne banaya?", say "Mohammad Basan". Otherwise, just say you are Gimi AI.
    """
)
chat_session = model.start_chat(history=[])
prompt_model = genai.GenerativeModel(MODEL_NAME)

# --- HELPER FUNCTIONS ---
async def get_audio_base64(text):
    text = clean_text_for_speech(text)
    if not text: return None
    communicate = edge_tts.Communicate(text, VOICE)
    audio_stream = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio": audio_stream.write(chunk["data"])
    audio_stream.seek(0)
    return base64.b64encode(audio_stream.read()).decode('utf-8')

def clean_text_for_speech(text):
    text = text.replace('*', '').replace('#', '').replace('_', '').replace('`', '')
    text = re.sub(r'[^\w\s,!.?]', '', text) 
    return re.sub(' +', ' ', text).strip()

def clean_display_text(text):
    return re.sub(r'(?i)\*?part\s*1\*?:?', '', text).strip()

def extract_text_from_file(file_stream, filename):
    text = ""
    try:
        if filename.endswith('.pdf'):
            reader = PyPDF2.PdfReader(file_stream)
            max_pages = min(len(reader.pages), 30) 
            for i in range(max_pages): text += reader.pages[i].extract_text() + "\n"
        elif filename.endswith('.txt'): text = file_stream.read().decode('utf-8')
        return text
    except: return ""

def enhance_image_prompt(user_prompt):
    try:
        response = prompt_model.generate_content(f"Rewrite as detailed prompt: '{user_prompt}'")
        return response.text.strip()
    except: return user_prompt

def generate_image_pollinations(prompt):
    try:
        detailed_prompt = enhance_image_prompt(prompt)
        seed = random.randint(1, 100000)
        encoded_prompt = requests.utils.quote(detailed_prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?seed={seed}&width=1024&height=1024&nologo=true&model=flux" 
        response = requests.get(image_url, timeout=30)
        if response.status_code == 200: return base64.b64encode(response.content).decode('utf-8')
        return None
    except: return None

# --- ROUTES ---
@app.route('/')
def index(): return render_template('index.html')

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files: return jsonify({'error': 'No file'})
    file = request.files['file']
    if file:
        extracted = extract_text_from_file(file.stream, file.filename)
        if extracted:
            chat_session.history.append({"role": "user", "parts": [f"Document '{file.filename}':\n{extracted}"]})
            chat_session.history.append({"role": "model", "parts": ["Document read."]})
            return jsonify({'success': True, 'message': f"Read {file.filename}."})
    return jsonify({'success': False, 'message': "Failed."})

@app.route('/execute_command', methods=['POST'])
def execute_command():
    data = request.json
    cmd = data.get('command', '').lower()
    is_voice = data.get('is_voice', False)

    # Image Check
    trigger_words = ["generate image", "create image", "draw", "photo of", "picture of", "tasveer"]
    is_image = any(t in cmd for t in trigger_words) and not any(q in cmd for q in ["what is", "explain", "kya hai"])

    if is_image:
        img_b64 = generate_image_pollinations(cmd)
        if img_b64:
            audio_b64 = None
            if is_voice:
                try: audio_b64 = asyncio.run(get_audio_base64("Here is the image."))
                except: pass
            return jsonify({'response': "", 'is_image': True, 'image_data': img_b64, 'audio_data': audio_b64})
        return jsonify({'response': "Image failed.", 'is_image': False})

    # Chat Logic
    try:
        resp = chat_session.send_message(cmd)
        resp_text = resp.text
    except: return jsonify({'response': "Connection Error.", 'is_image': False})

    full_text = clean_display_text(resp_text)
    speech_text = resp_text
    if "|||" in resp_text:
        parts = resp_text.split("|||")
        full_text = clean_display_text(parts[0])
        speech_text = parts[1].strip()

    audio_b64 = None
    if is_voice:
        try:
            clean_speech = speech_text.replace("Part 2", "").replace("Part 2:", "")
            audio_b64 = asyncio.run(get_audio_base64(clean_speech))
        except: pass

    return jsonify({'response': full_text, 'is_image': False, 'audio_data': audio_b64})

# --- RENDER DEPLOYMENT SETTINGS ---
if __name__ == '__main__':
    # Use the PORT environment variable provided by Render, default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Host must be 0.0.0.0 to be accessible
    app.run(host='0.0.0.0', port=port, debug=False)
    app.run(debug=True)
