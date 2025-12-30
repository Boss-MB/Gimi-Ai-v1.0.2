document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const timeDisplay = document.getElementById('time');
    const batteryDisplay = document.getElementById('battery');

    let recognition;
    let isListening = false;

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = marked.parse(text); 
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const handleTextCommand = async (command) => {
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
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong. Please try again later.', 'bot');
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