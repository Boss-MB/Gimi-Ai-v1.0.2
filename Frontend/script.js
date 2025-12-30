document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CRASH FIX: Paste your Heavy Base64 here inside quotes ---
    // GitHub HTML editor ab hang nahi hoga.
    const LOGO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAyADIAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAEsBdwDASIAAhEBAxEB/8QAHgABAAEDBQEAAAAAAAAAAAAAAAkCAwgBBAYHCgX/xAB1EAABAwIEAwIGCQoMEQcJBgcCAAMEBQYBBwgSERMiCTIUISMxQUIKFTNRUmJxcoEWJDhDU2F2grO0Fxk3OXR1kZKVodTiGBolNERUY3ODk5aisbK1wdM1V1iXo8LSJkZkZWaEhcTWKEVHd4fDSFaGpLbV8P/EAB0BAQACAgMBAQAAAAAAAAAAAAAEBgUHAgMIAQn/xABIEQABAwEDBA4GCAYCAgMAAAAAAQIDBAUREgYhMfAHEyIyQVFhcXKBkbHB0RQ0NUJSoRUWMzZTYoLhI1SSorLxQ3MkJRfC0v/aAAwDAQACEQMRAD8A8/6IiAIiIAiIgCIiAIiIAiIgKscMeHUS04YeglrgGOGPiw4rtzTjoU1datpgx9PGn+5rmZM3B9sYdNIYQk3t3iUlzazgQ7h6d27q8y+51U4veyNt7luOosRLh48Mf3Vrhhhj6v8AGpatN3sTvU5ebcaralc7besuI4Rc+m0doqlMEdvSQ49Lfe7w7lmxkh7GB7NXLAGZWZ0G7Mw5oRuVKbrNechRXHPujbULluD80niFSY6SaQxE9u2fD72LmPN/t4+jj8mC+5YmWGZOaNYwoGWeXVcuKcXdhUKkvTHf3jQkS9ZuUfZy6CshsKa7lPpAy9pMuk/1hWMbWiv1Fv43hr4lIIvjE5uXcBR2W92AMjh80FLjsxXb5xjpMqI03kfzPIh+l/a6f+hhmx/1d1P/AIC1/oANc/8A0Ms1v+rypf8ABXrrd76sl5sfkUttjMd7xH+tEv4Z5GMdBOubDxf0GGbGP/6d1P8A4C4ZmFktnHlHMGnZq5TXNbDx9xm4qHIhEX4rwivYm7/uW3cZYcHrZEvnCu1LCa7evOTcqH8MXzPGbi3jh48cMfkWnHh4uOK9cGbeibR5nnPlVfOHS1YFx1CbH5UirVe0IbszEfiySb5w/OEtyxWzh9jfdmTmS0DlmWRcdjSG2S4lbdzPOg44XdJxub4R3fgtk2uuTJ6qbvFRxMiympHb9qtPORhjiPewWmOOGPjwx4feUtef/sVrN63Yz9U056haVcmDbA4tUy4oBQH3nN3dExJxsR2+sXwVgNqU7OfWhpKOS9nfkHXqdTo27E65GiFJgcvBzl4OE+3uFsSIhwHftxLdh4ljZ7OrabO9hl6e0aKq+zedGImOGOHnwRQCaEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBETh6EBUOHi8RfxJ3cffxxWmOGI4+dd0aM9Bmp/XpmGOW+nLLWXWH8C/qhU3MOVBp47ccdz8gulvu+bvEhxkkZEzE9bkOmh8ePEsfowWYuhDsONduvHCLc1q5eFadoSNpfVfdrTkaM42QiQkyG3mP7hISEhHaXHvKZXsz/Y4mlTRaEDM/P4YuaWYzPJfB+owv6kUd4REvrSMXupC4JbZD3V0iQtsluUibcdmLGGNGZFptsNrTbYbREfgiK7I48WkrFflG1u4pk/UR36KPY1egDS4MS7c3qLIzbupjaZyLtaEaUy5uL3Knj5Mx2kIl4QT3U3uEW+6s/aXQqHbtNao9vUeLAhxwEGIsOOLQNiPSIiI9Ir6J93FWD9KyMbGN3pVZquoqnXyuxFl3uKy76Ved7isu+lTYyMWXPQrJ+lXnPQrJ+lS4wWXe+rJebH5Fed76sl5sfkUyMFh3/crRebH5Fdd/3K0Xmx+RTIwWXe+rZebD5Fcd76tl5sPkUxukG3c9C20yLGmMHGmRm3Gi77bgbhJblz0KyfpUyNEU+Itz8xhZrK7CfQfq0CXcVJsQcvLrkC4Q1+ymRjtOPFu2uPwvcXuotxEItuF90UTGtnsGdZ+k05ly2dQP0RbSZcImatbMcilMt79o86J7oJbdu7ZuHcXe6V6NHPQrB93FQKuwqGtS9G4V40MtR23XUi4b8TeU8eDgGJ7cePHDz8cFQXHHHz8V6SO0E7FPSdrkhybug0sbGvwm+LN10CIODcshEREZjHSMgdoiO4drg9PVtHaoNtbnZw6odBl0lR857KJykvOnhTLopWBP0+YAniIlzOHkyLxFy3NpdWHSqZaVh1dnLeqXs4y5UNr0tclyZncRj+iIsIZUIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiA18Y48MMUx3FjwVQgbjmACOJY4+LDDBTS9iF7HIdv5ii6t+0AtY2qAfLm2tlvMbIXKh6zcioD6rPdIY/2zxczgOOIFxV2Ei1dZDRRY5FMduyB9j85wdoBUY2bufxVixMpxaF1qohHEKjX8S7oQhdEhbb29XhBiQ93aJ7un0TaftM+Q+k/LWHlFp5yxpdq0CCAg1BprG0nCEdvMdcLyj7hbepxwiIi6iJc9iwYdNhs02mw248eO0LTEdloQBtsR2iIiPdEVbc9C5NdiKFaFpz178+9+EtuehWT9K1qE6HToL1SqUxthiO0Tr7zx7QbbEdxEReqKxdkak89tWrVTqulKvUnL/KmlPkE/O656d4U/WW2xIn3KJAc2slHEh5fthJImSLmcuPIEeYpLdJBijfIZOH3cVYP0qPy18uM+dVzE6bppz5zIo1jxTe8Lz6zOzBrAu154heIypNCp0iDH8FZLkCMpxxln3QW47wt7i4RYGT2su8nKhcHZ+6388ryGmxZkLHM/Oa+qcxZ0uY3yxIoULGlTJVRbFzmeU2ss+RLbKIlJbIS2UDF9/XXrJNHe4rLvpUWVB7SHtjtO9VG27uyPsPVVSqSUyPcteyYhVaM/T5beDZC3Im+B4Qdwi4Xk2Y5F09RN9O7tzTL7It7ObULKati9rwquV9w8wmnaXf0MWGBcFvc5tltk4zt3bmx5hNuEQ+5ipcdRFoccXWZVomJqYm/l1vM63PQrJ+lWaHcVvXVS263bFeh1KG57lKgyhdbL8YelXj9KyERAeioWXe+rJebH5Fed76sl5sfkUyM+Fh3/AHK0Xmx+RXXf9ytF5sfkUyMFl3vq2Xmw+RdMaou0S0ZaOKfjMz/z5o1Ik8djVKjulLnObSES2xmRJwtpEO7p6fWWG929u3qFz6tufWuzf7O287yo8PAWXb9uqE/jBiSBc8thjChcwng5e0twyG3OovJ9PV9fXUsTsKruiZDQVVRnRu5+LQhJO56FZP0qOG2Xe101MWnV8zpmpm0LpsmcbLWNu6drpZodZpznOb54su1ijuETjbZEXg70qOXTt5nqre5a5HZ7XdGrF+acdaeaWYr1DxabubJ3OO8KnQK9BkC2ThsDNgOsjGeMSER50V5ktvS4I+UXdHXOdoY7XXgOx1ntam6e3XuJC3PQrB93FYfZT3NqOqlMq1e0rZ312s1mz6k4xduQueox3JzLnMEvB2asz5aORMi54PIcKZHLmCRdO7b37kBqStLPyFVaazRKlbl023M8Duuza8DYVCkveru5ZELjLg9TbzZE24PdLvCOSp6psm53uuvKRJqd0e6Ofu9xcdzJy2sHN2zJ+X+aFoU+vUWotcqdS6pFF1p4fjCS5E73FZc82PyrKYGPZhcdCPVj8TSC3tWewUuzTqFW1BaQWpdfscpRPT7Q5RO1Cgtl9zLqKVHEt390bHbu5m0nFGc80bB4svDiJiXAhLDx4L1+vCDjWww4iXeElFV2y3YfRs0XZ+qrRnbLMa5Op+8LKiiLbVU8XEpkQftcj7o33XO8O1wS51Lt3JfC1aijTnb5eRcLJt9HObDUr1+ZCki3dUpVSotRkUqrwXYsmM6TT7D7WIm2Y48CHEcfGOK2ioSoqLcpbtIREXwBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAE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"; 
    
    // Set Logo automatically
    const imgElement = document.getElementById('brand-img');
    if(imgElement) imgElement.src = LOGO_BASE64;

    // --- 2. NEW ELEMENTS ---
    const chatZone = document.getElementById('chat-stream');
    const inpField = document.getElementById('input-msg');
    const btnSend = document.getElementById('action-send');
    const btnMic = document.getElementById('action-mic');
    const btnAttach = document.getElementById('action-attach');
    const hiddenFile = document.getElementById('input-file-hidden');
    const modal = document.getElementById('view-modal');
    const modalImg = document.getElementById('view-full-img');

    let recognition;
    let isListening = false;

    // Welcome
    setTimeout(() => pushMsg("Hello! I am Gimi AI.", 'bot'), 500);

    // --- FUNCTIONS ---
    const scrollDown = () => chatZone.scrollTo({ top: chatZone.scrollHeight, behavior: 'smooth' });
    
    window.closeModal = () => modal.style.display = 'none';
    modal.onclick = () => modal.style.display = 'none';

    const playAudio = (b64) => {
        if (!b64) return;
        new Audio("data:audio/mp3;base64," + b64).play().catch(console.error);
    };

    // --- BUTTON LOGIC ---
    
    // Typing Effect
    inpField.addEventListener('input', () => {
        if(inpField.value.trim()) btnSend.classList.add('ready');
        else btnSend.classList.remove('ready');
    });

    // Send Click
    btnSend.addEventListener('click', () => {
        const txt = inpField.value.trim();
        if(txt) runCmd(txt, false);
    });

    // Enter Key
    inpField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const txt = inpField.value.trim();
            if(txt) runCmd(txt, false);
        }
    });

    // Attach Click
    btnAttach.addEventListener('click', () => hiddenFile.click());
    
    hiddenFile.addEventListener('change', async () => {
        if (!hiddenFile.files[0]) return;
        const fd = new FormData();
        fd.append('file', hiddenFile.files[0]);
        pushMsg(`Uploading ${hiddenFile.files[0].name}...`, 'user');
        try {
            const r = await fetch('/upload_file', { method: 'POST', body: fd });
            pushMsg((await r.json()).message, 'bot');
        } catch { pushMsg("Upload Failed.", 'bot'); }
    });

    // Mic Click
    btnMic.addEventListener('click', () => {
        if (!window.webkitSpeechRecognition) return alert("Mic not supported.");
        if (isListening) {
            if(recognition) recognition.stop();
        } else {
            recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.onstart = () => { isListening=true; btnMic.classList.add('active'); };
            recognition.onend = () => { isListening=false; btnMic.classList.remove('active'); };
            recognition.onresult = (e) => {
                const t = e.results[e.results.length-1][0].transcript;
                inpField.value = t;
                runCmd(t, true);
            };
            recognition.start();
        }
    });

    // --- CORE LOGIC ---
    const pushMsg = (txt, role, isImg=false) => {
        const row = document.createElement('div');
        row.className = `msg-row row-${role}`;
        
        const bub = document.createElement('div');
        bub.className = `bubble bub-${role}`;
        
        if(isImg) {
            bub.innerHTML = `Generated Image:<br><img src='data:image/jpeg;base64,${txt}' onclick="document.getElementById('view-full-img').src=this.src;document.getElementById('view-modal').style.display='flex'">`;
        } else {
            bub.innerHTML = marked.parse(txt);
        }
        
        row.appendChild(bub);
        chatZone.appendChild(row);
        scrollDown();
        return row; // Return for removing if needed
    };

    const runCmd = async (cmd, voiceMode) => {
        pushMsg(cmd, 'user');
        inpField.value = '';
        btnSend.classList.remove('ready');

        const loadRow = pushMsg("Thinking...", 'bot');

        try {
            const req = await fetch('/execute_command', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ command: cmd, is_voice: voiceMode })
            });
            
            // Remove Thinking
            loadRow.remove();
            
            const res = await req.json();
            if (res.is_image) pushMsg(res.image_data, 'bot', true);
            else pushMsg(res.response, 'bot');

            if (res.audio_data) playAudio(res.audio_data);

        } catch (e) {
            loadRow.remove();
            pushMsg("Server Error.", 'bot');
        }
    };
});
ceCommand = async (command) => {
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


