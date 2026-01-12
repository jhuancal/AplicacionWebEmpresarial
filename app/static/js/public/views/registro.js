document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step-item');
    const progressFill = document.querySelector('.steps-progress-fill');

    // --- Navigation Logic ---

    window.nextStep = function () {
        if (currentStep < steps.length - 1) {
            if (!validateStep(currentStep)) return;

            steps[currentStep].classList.remove('active');
            stepIndicators[currentStep].classList.add('completed');
            stepIndicators[currentStep].classList.remove('active');

            currentStep++;

            steps[currentStep].classList.add('active');
            stepIndicators[currentStep].classList.add('active');

            updateProgress();
            window.scrollTo(0, 0);
        }
    };

    window.prevStep = function () {
        if (currentStep > 0) {
            steps[currentStep].classList.remove('active');
            stepIndicators[currentStep].classList.remove('active');

            currentStep--;

            steps[currentStep].classList.add('active');
            stepIndicators[currentStep].classList.add('active');
            stepIndicators[currentStep].classList.remove('completed');

            updateProgress();
        }
    };

    function updateProgress() {
        const progress = (currentStep / (steps.length - 1)) * 100;
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    function validateStep(step) {
        // Step 0: Email Verification
        if (step === 0) {
            const correoFinal = document.getElementById('correo-final');
            if (!correoFinal.value) {
                alert('Por favor verifica tu correo electrónico para continuar.');
                return false;
            }
        }

        // Step 1: Personal Data
        if (step === 1) {
            const inputs = steps[1].querySelectorAll('input[required]');
            for (let input of inputs) {
                if (!input.value) {
                    alert('Por favor completa todos los campos requeridos.');
                    return false;
                }
            }
        }

        // Step 2: Payment (Mock validation)
        if (step === 2) {
            const inputs = steps[2].querySelectorAll('input[required]');
            for (let input of inputs) {
                if (!input.value) {
                    alert('Por favor completa los datos de pago.');
                    return false;
                }
            }
        }

        return true;
    }

    // --- Email Verification Logic ---

    window.sendVerificationCode = async function () {
        const email = document.getElementById('email-verification').value;
        const btnSend = document.getElementById('btn-send-code');
        const codeSection = document.getElementById('code-section');

        if (!email || !email.includes('@')) {
            alert('Por favor ingresa un correo válido.');
            return;
        }

        btnSend.disabled = true;
        btnSend.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/auth/initiate-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();

            if (result.success || response.ok) {
                btnSend.textContent = 'Reenviar';
                btnSend.disabled = false;
                codeSection.classList.remove('is-hidden');
                alert('Código enviado a tu correo. Por favor revísalo.');
            } else {
                btnSend.textContent = 'Enviar Código de Verificación';
                btnSend.disabled = false;
                alert('Error al enviar código: ' + (result.message || 'Intente de nuevo.'));
            }
        } catch (error) {
            console.error(error);
            btnSend.textContent = 'Enviar Código de Verificación';
            btnSend.disabled = false;
            alert('Error de conexión.');
        }
    };

    window.verifyCode = async function () {
        const code = document.getElementById('verification-code').value;
        const email = document.getElementById('email-verification').value;
        const btnVerify = document.getElementById('btn-verify-code');

        if (!code || code.length < 6) {
            alert('Ingresa el código completo.');
            return;
        }

        btnVerify.disabled = true;
        btnVerify.textContent = 'Verificando...';

        try {
            const response = await fetch('/api/auth/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo: email, verification_code: code }) // Matches backend keys
            });

            const result = await response.json();

            if (result.success || response.ok) {
                document.getElementById('correo-final').value = email;
                alert('Correo verificado correctamente.');

                document.getElementById('verification-code').disabled = true;
                btnVerify.textContent = 'Verificado ✓';
                btnVerify.classList.remove('is-info');
                btnVerify.classList.add('is-success');

                // Optional: Auto-next
                // nextStep();
            } else {
                btnVerify.disabled = false;
                btnVerify.textContent = 'Verificar Código';
                alert('Código incorrecto: ' + (result.message || 'Inténtalo de nuevo.'));
            }
        } catch (error) {
            console.error(error);
            btnVerify.disabled = false;
            btnVerify.textContent = 'Verificar Código';
            alert('Error de conexión al verificar.');
        }
    };

    // --- Form Submission ---

    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Backend expects 'verification_code' but input name is not set in HTML?
            // Let's check HTML. Ah, verification-code input has ID but maybe not name?
            // Or maybe it is separate.
            // We need to send verification_code because register_client implementation CHECKS IT AGAIN.

            const codeInput = document.getElementById('verification-code');
            if (codeInput) {
                data.verification_code = codeInput.value;
            }
            // Also need "correo" which is in 'correo-final' input (name="correo"), so that should be fine.

            data.tipo_usuario = 'Cliente';

            // Prepare nested 'mascota' object if needed
            if (data.mascota_nombre) {
                data.mascota = {
                    nombre: data.mascota_nombre,
                    tipo: data.mascota_tipo,
                    raza: data.mascota_raza,
                    fecha_nacimiento: data.mascota_fecha
                };
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success || response.ok) {
                    showAdoptionModal('¡Registro Exitoso! Bienvenido a la familia Almas Salvajes.');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    alert('Error en el registro: ' + (result.message || 'Intente nuevamente.'));
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Hubo un problema al conectar con el servidor.');
            }
        });
    }

    function showAdoptionModal(message) {
        alert(message);
    }

    updateProgress();
});
