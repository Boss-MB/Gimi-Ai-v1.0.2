import os
import subprocess
import webbrowser
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__,
            template_folder='Frontend',
            static_folder='Frontend')
CORS(app)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_gemini_response(prompt):
    try:
        model = genai.GenerativeModel(
            'models/gemini-2.5-flash',
            system_instruction="Your Name Is Gimi Ai, You are Created by Mohammad Basan. You are a helpful assistant."
        )
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Sorry, I can't connect to the AI right now."

def execute_pc_command(command):
    command = command.lower()
    if "open notepad" in command:
        subprocess.Popen(['notepad.exe'])
        return "Opening Notepad."
    elif "open calculator" in command:
        subprocess.Popen(['calc.exe'])
        return "Opening Calculator."
    elif "open google" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Google."
    elif "shutdown" in command or "shut down" in command:
        os.system("shutdown /s /t 1")
        return "Shutting down the PC. Goodbye!"
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/execute_command', methods=['POST'])
def execute_command():
    user_command = request.json.get('command')
    print(f"User Command Received: {user_command}")
    pc_response = execute_pc_command(user_command)
    if pc_response:
        return jsonify({'response': pc_response})
    gemini_response = get_gemini_response(user_command)
    return jsonify({'response': gemini_response})

if __name__ == '__main__':
    app.run(debug=True)