document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const modal = document.getElementById('img-modal');
    const fullImage = document.getElementById('full-image');

    let recognition;
    let isListening = false;

    // --- WELCOME ---
    setTimeout(() => addMessage("Hello! I am Gimi AI.", 'bot', false, true), 500);

    // --- HELPER: SCROLL ---
    const scrollToBottom = () => {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    };

    // --- MODAL ---
    window.openModal = (src) => {
        fullImage.src = src;
        modal.style.display = 'flex';
    };
    modal.onclick = () => modal.style.display = 'none';

    // --- BASE64 AUDIO ---
    const playBase64Audio = (b64) => {
        if (!b64) return;
        new Audio("data:audio/mp3;base64," + b64).play().catch(console.error);
    };

    // --- SEND BTN COLOR ---
    userInput.addEventListener('input', () => {
        if (userInput.value.trim().length > 0) sendBtn.classList.add('active');
        else sendBtn.classList.remove('active');
    });

    // --- ENTER KEY TO SEND ---
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (userInput.value.trim()) handleCommand(userInput.value.trim(), false);
        }
    });

    // --- ADD MESSAGE ---
    const addMessage = (content, sender, isImage = false, shouldScroll = true) => {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}-wrapper`;
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${sender}-bubble`;

        if (isImage) {
            bubble.innerHTML = `Generated Image:<br><img src='data:image/jpeg;base64,${content}' onclick="openModal(this.src)">`;
        } else {
            bubble.innerHTML = marked.parse(content);
        }
        
        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);

        if (shouldScroll) scrollToBottom();
        
        return bubble;
    };

    // --- MAIN HANDLER ---
    const handleCommand = async (command, isVoice) => {
        // User Msg -> Scroll TRUE
        addMessage(command, 'user', false, true);
        userInput.value = '';
        sendBtn.classList.remove('active');
        if (isVoice) stopRecognition();

        // Thinking -> Scroll TRUE
        const loading = addMessage("Thinking...", 'bot', false, true);

        try {
            const res = await fetch('/execute_command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: command, is_voice: isVoice }),
            });
            
            loading.parentElement.remove();
            const data = await res.json();

            // Bot Response -> Scroll FALSE (Stay for reading)
            if (data.is_image) addMessage(data.image_data, 'bot', true, false);
            else addMessage(data.response, 'bot', false, false);

            if (data.audio_data) playBase64Audio(data.audio_data);
        } catch {
            loading.parentElement.remove();
            addMessage('Connection Error.', 'bot', false, false);
        }
    };

    // --- ATTACH & MIC ---
    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        if (!fileInput.files[0]) return;
        const fd = new FormData();
        fd.append('file', fileInput.files[0]);
        addMessage(`Uploading ${fileInput.files[0].name}...`, 'user', false, true);
        try {
            const r = await fetch('/upload_file', { method: 'POST', body: fd });
            addMessage((await r.json()).message, 'bot', false, true);
        } catch { addMessage("Upload Failed.", 'bot', false, true); }
        fileInput.value = '';
    });

    const startRecognition = () => {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return alert("Mic not supported.");
        recognition = new Speech();
        recognition.lang = 'en-IN';
        recognition.onstart = () => { isListening=true; micBtn.classList.add('listening'); };
        recognition.onend = () => { isListening=false; micBtn.classList.remove('listening'); };
        recognition.onresult = (e) => {
            const t = e.results[e.results.length-1][0].transcript;
            userInput.value = t;
            handleCommand(t, true);
        };
        try { recognition.start(); } catch {}
    };
    const stopRecognition = () => { if (recognition) recognition.stop(); };
    micBtn.addEventListener('click', () => isListening ? stopRecognition() : startRecognition());
    sendBtn.addEventListener('click', () => { if(userInput.value.trim()) handleCommand(userInput.value.trim(), false); });
});
        }
    };
    
    const handleVoiceCommand = async (command) => {
        addMessage(command, 'user');
        userInput.value = '';

        try {
            const response = await fetch('/execute_command', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: command }),
            });
            const data = await response.json();
            addMessage(data.response, 'bot');
            speak(data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again later.', 'bot');
            speak('Sorry, something went wrong. Please try again later.');
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.lang.startsWith('hi') || voice.lang.startsWith('en'));
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        speechSynthesis.speak(utterance);
    };

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition. Try Chrome.');
            return;
        }

        recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening = true;
            micBtn.style.backgroundColor = '#f00'; 
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start(); 
            }
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[event.results.length - 1][0].transcript;
            userInput.value = speechResult;
            handleVoiceCommand(speechResult);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
        };

        recognition.start();
    };

    const stopRecognition = () => {
        isListening = false;
        if (recognition) {
            recognition.stop();
        }
        micBtn.style.backgroundColor = '#3e2646'; 
    };

    sendBtn.addEventListener('click', () => {
        const typedText = userInput.value.trim();
        if (typedText) {
            handleTextCommand(typedText);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const typedText = userInput.value.trim();
            if (typedText) {
                handleTextCommand(typedText);
            }
        }
    });

    micBtn.addEventListener('click', () => {
        if (isListening) {
            stopRecognition();
        } else {
            startRecognition();
        }
    });
    
    const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    };

    const updateBatteryStatus = () => {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.round(battery.level * 100);
                batteryDisplay.textContent = `${level}%`;
            });
        } else {
            batteryDisplay.textContent = 'N/A';
        }
    };

    setInterval(updateTime, 1000);
    updateTime();
    updateBatteryStatus();
    setInterval(updateBatteryStatus, 60000);

    const welcomeMessage = "Hello, I am Atlas Ai, your personal assistant. How can I help you today?";
    addMessage(welcomeMessage, 'bot');

});
