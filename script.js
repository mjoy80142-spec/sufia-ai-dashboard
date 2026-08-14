function processActivation() {
    const keyInput = document.getElementById("activationKey").value.trim();
    const responseBox = document.getElementById("responseBox");
    const responseText = document.getElementById("responseText");
    const spinner = document.getElementById("spinner");

    if (keyInput === "") {
        responseBox.classList.remove("hidden");
        spinner.style.display = "none";
        responseBox.style.color = "#f87171";
        responseBox.style.border = "1px solid rgba(248, 113, 113, 0.3)";
        responseText.innerText = "দয়া করে একটি সঠিক অ্যাক্টিভেশন কি প্রবেশ করান!";
        return;
    }

    // Show Loading
    responseBox.classList.remove("hidden");
    spinner.style.display = "block";
    responseBox.style.color = "#38bdf8";
    responseBox.style.border = "1px solid rgba(56, 189, 248, 0.3)";
    responseText.innerText = "সার্ভারের সাথে সংযোগ স্থাপন করা হচ্ছে...";

    // Simulate Activation Process
    setTimeout(() => {
        spinner.style.display = "none";
        responseBox.style.color = "#4ade80";
        responseBox.style.border = "1px solid rgba(74, 222, 128, 0.3)";
        responseText.innerText = "সফল হয়েছে! আপনার সুফিয়া এআই অ্যাসিস্ট্যান্ট সক্রিয় হয়েছে।";
    }, 2500);
}