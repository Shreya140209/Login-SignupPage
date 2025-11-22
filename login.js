
let currentMode = 'signup';
let currentStep = 1;
let totalSteps = 3;
const formData = {};

// Initialize
updateProgress();

function selectMode(mode) {
    currentMode = mode;
    currentStep = 1;

    // Update mode buttons
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show/hide flows
    const signupFlow = document.getElementById('signupFlow');
    const loginFlow = document.getElementById('loginFlow');

    if (mode === 'signup') {
        signupFlow.style.display = 'block';
        loginFlow.style.display = 'none';
        totalSteps = 3;
    } else {
        signupFlow.style.display = 'none';
        loginFlow.style.display = 'block';
        totalSteps = 1;
    }

    updateProgress();
    updateStep();
}

function updateProgress() {
    const progressSteps = document.getElementById('progressSteps');

    if (currentMode === 'signup') {
        progressSteps.innerHTML = `
                    <div class="progress-line" id="progressLine"></div>
                    <div class="step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}" data-step="1">
                        <div class="step-circle">1</div>
                        <div class="step-label">Personal</div>
                    </div>
                    <div class="step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}" data-step="2">
                        <div class="step-circle">2</div>
                        <div class="step-label">Account</div>
                    </div>
                    <div class="step ${currentStep >= 3 ? 'active' : ''}" data-step="3">
                        <div class="step-circle">3</div>
                        <div class="step-label">Confirm</div>
                    </div>
                `;
    } else {
        progressSteps.innerHTML = `
                    <div class="progress-line" id="progressLine"></div>
                    <div class="step active" data-step="1">
                        <div class="step-circle">1</div>
                        <div class="step-label">Login</div>
                    </div>
                `;
    }

    updateProgressLine();
}

function updateProgressLine() {
    const progressLine = document.getElementById('progressLine');
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
}

function nextStep() {
    if (currentMode === 'login') {
        submitForm();
        return;
    }

    if (validateStep(currentStep)) {
        saveStepData(currentStep);

        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();

            if (currentStep === totalSteps) {
                showSummary();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

function updateStep() {
    const flowId = currentMode === 'signup' ? 'signupFlow' : 'loginFlow';
    const steps = document.querySelectorAll(`#${flowId} .form-step`);

    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    updateProgress();
    updateButtons();
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (currentMode === 'login') {
        prevBtn.style.display = 'none';
        nextBtn.textContent = 'Login';
        submitBtn.style.display = 'none';
    } else {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';

        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            nextBtn.textContent = 'Next Step';
            submitBtn.style.display = 'none';
        }
    }
}

function validateStep(step) {
    if (currentMode === 'login') {
        return validateEmail('loginEmail') && validateField('loginPassword', 'Password is required');
    }

    let isValid = true;

    if (step === 1) {
        isValid = validateField('firstName', 'First name is required') && isValid;
        isValid = validateField('lastName', 'Last name is required') && isValid;
        isValid = validateEmail('signupEmail') && isValid;
    } else if (step === 2) {
        isValid = validatePassword('signupPassword') && isValid;
        isValid = validateConfirmPassword('confirmPass', 'signupPassword') && isValid;
    }

    return isValid;
}

function validateField(fieldId, message) {
    const field = document.getElementById(fieldId);

    if (!field.value.trim()) {
        showError(fieldId, message);
        return false;
    }

    clearError(fieldId);
    return true;
}

function validateEmail(fieldId) {
    const field = document.getElementById(fieldId);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!field.value.trim()) {
        showError(fieldId, 'Email is required');
        return false;
    }

    if (!emailRegex.test(field.value)) {
        showError(fieldId, 'Please enter a valid email');
        return false;
    }

    clearError(fieldId);
    return true;
}

function validatePassword(fieldId) {
    const field = document.getElementById(fieldId);

    if (!field.value) {
        showError(fieldId, 'Password is required');
        return false;
    }

    if (field.value.length < 8) {
        showError(fieldId, 'Password must be at least 8 characters');
        return false;
    }

    clearError(fieldId);
    return true;
}

function validateConfirmPassword(fieldId, passwordId) {
    const field = document.getElementById(fieldId);
    const passwordField = document.getElementById(passwordId);

    if (!field.value) {
        showError(fieldId, 'Please confirm your password');
        return false;
    }

    if (field.value !== passwordField.value) {
        showError(fieldId, 'Passwords do not match');
        return false;
    }

    clearError(fieldId);
    return true;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    field.classList.remove('error');
    errorElement.classList.remove('show');
}

function saveStepData(step) {
    if (step === 1) {
        formData.firstName = document.getElementById('firstName').value;
        formData.lastName = document.getElementById('lastName').value;
        formData.email = document.getElementById('signupEmail').value;
    } else if (step === 2) {
        formData.password = document.getElementById('signupPassword').value;
    }
}

function showSummary() {
    const summaryBox = document.getElementById('summaryBox');
    summaryBox.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Name:</span>
                    <span class="summary-value">${formData.firstName} ${formData.lastName}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Email:</span>
                    <span class="summary-value">${formData.email}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Password:</span>
                    <span class="summary-value">••••••••</span>
                </div>
            `;
}

function submitForm() {
    if (currentMode === 'login') {
        if (!validateStep(1)) return;

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Login:', { email, password });

        document.getElementById('successTitle').textContent = 'Welcome Back!';
        document.getElementById('successMessage').textContent = 'You have successfully logged in.';
    } else {
        console.log('Signup:', formData);

        document.getElementById('successTitle').textContent = 'Account Created!';
        document.getElementById('successMessage').textContent = 'Your account has been successfully created.';
    }

    // Hide buttons and forms
    document.getElementById('wizardButtons').style.display = 'none';
    document.querySelectorAll('.form-step').forEach(step => {
        step.style.display = 'none';
    });

    // Show success
    document.getElementById('successScreen').classList.add('show');
    document.getElementById('progressLine').style.width = '100%';
}