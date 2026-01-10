let currentStep = 0;
const totalSteps = 4;

function updateProgress() {
    const progressLine = document.getElementById('progress-line');
    const steps = document.querySelectorAll('.progress-step');

    // Update Line
    const percent = (currentStep / (totalSteps - 1)) * 100;
    progressLine.style.width = percent + '%';

    // Update Circles
    steps.forEach((step, index) => {
        // Reset classes first
        step.classList.remove('active', 'completed');

        if (index < currentStep) {
            step.classList.add('completed');
            step.querySelector('.circle').innerHTML = '✓';
        } else if (index === currentStep) {
            step.classList.add('active');
            step.querySelector('.circle').innerText = index + 1;
        } else {
            step.querySelector('.circle').innerText = index + 1;
        }
    });
}

function showStep(step) {
    const contents = document.querySelectorAll('.step-content');
    contents.forEach((el, index) => {
        el.classList.remove('active', 'prev');
        if (index === step) {
            el.classList.add('active');
        } else if (index < step) {
            el.classList.add('prev');
        }
    });
    updateProgress();
}

function nextStep() {
    // Validate current step before moving
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateCurrentStep() {
    // Simple verification (can be expanded)
    const currentEl = document.getElementById(`step-${currentStep}`);
    const inputs = currentEl.querySelectorAll('input[required]');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value) {
            input.classList.add('border-red-500');
            valid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    return valid;
}

// Ensure first load is correct
document.addEventListener('DOMContentLoaded', () => {
    showStep(0);
});

async function sendVerificationCode() {
    const emailInput = document.getElementById('email-verification');
    const email = emailInput.value;
    const errorEl = document.getElementById('email-error');
    const btn = document.getElementById('btn-send-code');

    if (!email || !email.includes('@')) {
        errorEl.textContent = "Por favor ingresa un correo válido.";
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-pulse">Enviando...</span>`;

    try {
        const response = await fetch('/api/auth/initiate-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const result = await response.json();

        if (result.success) {
            document.getElementById('code-section').classList.remove('hidden');
            // Smooth scroll to code section
            document.getElementById('code-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            errorEl.textContent = result.message || "Error al enviar código.";
            errorEl.classList.remove('hidden');
        }
    } catch (e) {
        errorEl.textContent = "Error de conexión.";
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = "Enviar Código";
    }
}

async function verifyCode() {
    const code = document.getElementById('verification-code').value;
    const email = document.getElementById('email-verification').value;
    const errorEl = document.getElementById('code-error');

    if (code.length < 6) {
        errorEl.textContent = "El código debe tener 6 caracteres.";
        errorEl.classList.remove('hidden');
        return;
    }

    // Since we don't have a dedicated verification endpoint separate from Register (per plan),
    // we simply enforce length and proceed. Ideally, we would HIT backend here.
    // For now, let's behave as if we are verifying successfully if length is 6 so user sees UI transition.
    // The REAL check happens on final Submit.

    document.getElementById('correo-final').value = email;
    currentStep++;
    showStep(currentStep); // Go to Personal Info
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    data.verification_code = document.getElementById('verification-code').value;
    data.correo = document.getElementById('email-verification').value;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Registrando...";

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Confetti or Success Animation could go here
            alert("¡Registro exitoso! Bienvenido a SuperPet.");
            window.location.href = "/";
        } else {
            alert("Error: " + result.message);
            if (result.message.includes("code")) {
                currentStep = 0; // Go back to verify if code is wrong
                showStep(currentStep);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Ocurrió un error al registrar.");
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
});
