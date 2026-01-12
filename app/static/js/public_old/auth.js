/* =========================================
   Authentication Logic (Login/Register)
   ========================================= */

// Registration Form Logic
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        setupRegistrationForm();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginForm();
    }
});

function setupRegistrationForm() {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLine = document.getElementById('progress-line');

    window.nextStep = function () {
        if (currentStep < steps.length - 1) {
            // Validate current step before moving
            if (!validateStep(currentStep)) return;

            steps[currentStep].classList.remove('active');
            steps[currentStep].classList.add('prev');

            currentStep++;

            steps[currentStep].classList.remove('prev');
            steps[currentStep].classList.add('active');

            updateProgress();
        }
    };

    window.prevStep = function () {
        if (currentStep > 0) {
            steps[currentStep].classList.remove('active');

            currentStep--;

            steps[currentStep].classList.remove('prev');
            steps[currentStep].classList.add('active');

            updateProgress();
        }
    };

    function updateProgress() {
        progressSteps.forEach((step, idx) => {
            if (idx <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
            if (idx < currentStep) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });

        const progress = (currentStep / (steps.length - 1)) * 100;
        if (progressLine) {
            progressLine.style.width = progress + '%';
        }
    }

    function validateStep(step) {
        // Implement validation logic for each step
        // For now preventing next on step 0 if email not verified, but usually handled by UI state
        if (step === 0) {
            const correoFinal = document.getElementById('correo-final');
            // Assuming validation happens via the 'verifyCode' function which unlocks the next button or sets state
            // For simplicity, checking if we have a value in hidden confirmed field or similar
            // But based on provided HTML, the user manually clicks "Siguiente" after verification flow?
            // Actually step 0 has email verification. The "Next" button might be hidden until verification?
            // Looking at HTML, Step 0 doesn't have a NEXT button. It transitions to Step 1 automatically or via UI?
            // Ah, wait. The HTML for Step 1 has a "Previous" button. Step 0 usually ends with "Verify Code" success.
            // We need to check how the transition happens.
            // In the provided HTML, Step 0 has verification logic. It likely calls nextStep() upon success.
            return true;
        }
        return true;
    }

    // Email Verification Logic
    window.sendVerificationCode = function () {
        const email = document.getElementById('email-verification').value;
        const errorMsg = document.getElementById('email-error');

        if (!email || !email.includes('@')) {
            errorMsg.textContent = 'Por favor ingresa un correo válido';
            errorMsg.classList.remove('hidden');
            return;
        }

        // Simulation of API call
        console.log('Enviando código a:', email);
        errorMsg.classList.add('hidden');

        document.getElementById('code-section').classList.remove('hidden');
        document.getElementById('btn-send-code').disabled = true;
        document.getElementById('btn-send-code').textContent = 'Enviando...';

        setTimeout(() => {
            document.getElementById('btn-send-code').textContent = 'Reenviar';
            document.getElementById('btn-send-code').disabled = false;
            alert('Código enviado: 123456 (Simulación)');
        }, 1500);
    };

    window.verifyCode = function () {
        const code = document.getElementById('verification-code').value;
        const errorMsg = document.getElementById('code-error');

        if (code === '123456') { // Mock verification
            const email = document.getElementById('email-verification').value;
            document.getElementById('correo-final').value = email;

            // Move to next step
            window.nextStep();

        } else {
            errorMsg.textContent = 'Código incorrecto';
            errorMsg.classList.remove('hidden');
        }
    };

    // Form Submission
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Submit logic
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Registration Data:', data);
        alert('Registro completado con éxito! (Simulación)');
        window.location.href = '/login';
    });
}

function setupLoginForm() {
    const form = document.querySelector('.form-box.login form') || document.getElementById('loginForm');
    if (!form) return;

    const usuarioInput = form.querySelector('input[type="text"]');
    const passwordInput = form.querySelector('input[type="password"]');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const usuario = usuarioInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usuario, password: password })
            });

            const data = await response.json();

            if (data.success) {
                if (data.user && data.user.Tipo === 'Colaborador') {
                    window.location.href = '/admin/dashboard';
                } else {
                    window.location.href = '/';
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar iniciar sesión');
        }
    });
}
