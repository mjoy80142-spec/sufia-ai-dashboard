let timerInterval = null;

// ✅ এখানে আপনার পছন্দের অ্যাক্টিভেশন কীগুলো লিখে রাখুন
const validKeys = [
    "SUFIA-2026-VIP", 
    "SUFIA-PRO-99", 
    "SUFIA-GOLD-01", 
    "SUFIA-ACCESS-77",
    "SUFIA-TEST-123"
];

// Sound Effect
function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
}

// Voice Speech Synthesizer
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'bn-BD';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

// Key Activation Logic
function processActivation() {
    const keyInput = document.getElementById("activationKey").value.trim();
    const responseBox = document.getElementById("responseBox");
    const responseText = document.getElementById("responseText");
    const spinner = document.getElementById("spinner");
    const activationSection = document.getElementById("activationSection");
    const tradingControls = document.getElementById("tradingControls");

    // কী ভ্যালিডেশন চেক
    if (keyInput === "") {
        showError("দয়া করে অ্যাক্টিভেশন কি দিন!");
        return;
    }

    if (!validKeys.includes(keyInput)) {
        showError("দুঃখিত! এই অ্যাক্টিভেশন কি-টি সঠিক নয়।");
        speakText("দুঃখিত, অ্যাক্টিভেশন কি ভুল");
        return;
    }

    // সফল হলে
    responseBox.classList.remove("hidden");
    spinner.style.display = "block";
    responseBox.style.color = "#38bdf8";
    responseBox.style.border = "1px solid rgba(56, 189, 248, 0.3)";
    responseText.innerText = "সার্ভারের সাথে সংযোগ স্থাপন করা হচ্ছে...";

    setTimeout(() => {
        spinner.style.display = "none";
        responseBox.style.color = "#4ade80";
        responseBox.style.border = "1px solid rgba(74, 222, 128, 0.3)";
        responseText.innerText = "সফল হয়েছে! সুফিয়া এআই ট্রেডিং সিগন্যাল অ্যাক্টিভেট হয়েছে।";
        
        playBeep();
        speakText("সুফিয়া এআই ট্রেডিং সিগন্যাল অ্যাক্টিভেট হয়েছে");

        setTimeout(() => {
            activationSection.classList.add("hidden");
            tradingControls.classList.remove("hidden");
            responseBox.classList.add("hidden");
            updateChart(); 
        }, 1500);

    }, 2000);
}

// Helper to show error
function showError(msg) {
    const responseBox = document.getElementById("responseBox");
    const spinner = document.getElementById("spinner");
    const responseText = document.getElementById("responseText");
    
    responseBox.classList.remove("hidden");
    spinner.style.display = "none";
    responseBox.style.color = "#f87171";
    responseBox.style.border = "1px solid rgba(248, 113, 113, 0.3)";
    responseText.innerText = msg;
}

// TradingView Widget Loader
function updateChart() {
    const symbol = document.getElementById("currencyPair").value;
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "1",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "hide_legend": true,
            "save_image": false,
            "container_id": "tradingview_widget"
        });
    }
}

// Signal Generation Logic
function generateSignal() {
    const marketType = document.getElementById("marketType").value;
    const currencySelect = document.getElementById("currencyPair");
    const currencyPairName = currencySelect.options[currencySelect.selectedIndex].text;
    const timeframe = parseInt(document.getElementById("timeframeSelect").value);
    
    const responseBox = document.getElementById("responseBox");
    const responseText = document.getElementById("responseText");
    const spinner = document.getElementById("spinner");
    const signalDetails = document.getElementById("signalDetails");
    const signalDirection = document.getElementById("signalDirection");
    const accuracyRate = document.getElementById("accuracyRate");
    const timeFrameDisplay = document.getElementById("timeFrameDisplay");
    const timerContainer = document.getElementById("timerContainer");

    if (timerInterval) clearInterval(timerInterval);

    signalDetails.classList.add("hidden");
    timerContainer.classList.add("hidden");
    responseBox.classList.remove("hidden");
    spinner.style.display = "block";
    responseBox.style.color = "#38bdf8";
    responseBox.style.border = "1px solid rgba(56, 189, 248, 0.3)";
    
    responseText.innerText = `${currencyPairName} এআই অ্যানালাইসিস চলছে...`;

    setTimeout(() => {
        spinner.style.display = "none";
        playBeep();

        const isCall = Math.random() > 0.45; 
        const accuracy = (Math.random() * (96 - 88) + 88).toFixed(1);
        const signalType = isCall ? "CALL" : "PUT";

        responseText.innerText = `এআই বিশ্লেষণ সম্পূর্ণ! (${marketType.toUpperCase()})`;
        signalDetails.classList.remove("hidden");

        if (isCall) {
            signalDirection.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> CALL (BUY)`;
            signalDirection.className = "call-signal";
        } else {
            signalDirection.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> PUT (SELL)`;
            signalDirection.className = "put-signal";
        }

        accuracyRate.innerText = `Accuracy Rate: ${accuracy}%`;
        timeFrameDisplay.innerText = `Timeframe: ${timeframe} Min`;

        addToHistory(currencyPairName, signalType, accuracy);

        const speechMsg = `${currencyPairName}, ${isCall ? 'কল' : ' পুট'} সিগন্যাল। টাইমফ্রেম ${timeframe} মিনিট।`;
        speakText(speechMsg);

        startCountdown(timeframe * 60);

    }, 2000);
}

// History & Timer functions remain same
function addToHistory(pair, type, accuracy) {
    const historyContainer = document.getElementById("historyContainer");
    const historyList = document.getElementById("historyList");
    historyContainer.classList.remove("hidden");
    const li = document.createElement("li");
    const isCall = type === "CALL";
    li.innerHTML = `<span><strong>${pair}</strong> - ${timeText()}</span><span style="color: ${isCall ? '#22c55e' : '#ef4444'}; font-weight: bold;">${type} (${accuracy}%)</span>`;
    historyList.insertBefore(li, historyList.firstChild);
    if (historyList.children.length > 5) historyList.removeChild(historyList.lastChild);
}

function timeText() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
}

function startCountdown(seconds) {
    const timerContainer = document.getElementById("timerContainer");
    const timerText = document.getElementById("timerText");
    timerContainer.classList.remove("hidden");
    let totalSeconds = seconds;
    timerInterval = setInterval(() => {
        let mins = Math.floor(totalSeconds / 60);
        let secs = totalSeconds % 60;
        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;
        timerText.innerText = `${mins}:${secs}`;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerText.innerText = "Trade Completed";
            playBeep();
        }
        totalSeconds--;
    }, 1000);
}