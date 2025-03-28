document.addEventListener('DOMContentLoaded', function() {
    const missionButton = document.getElementById('mission-title');
    const missionStatement = document.getElementById('mission-statement');
    const formButton = document.getElementById('form-button');
    const formContainer = document.getElementById('form-container');

    // Authentication Elements
    const loginToggle = document.getElementById('login-toggle');
    const loginModal = document.getElementById('login-modal');
    const closeButton = document.querySelector('.close-button');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const ProviderRegisterForm = document.getElementById('Provider-Register-Form');
    const authMessage = document.getElementById('auth-message');

    // Form Switch Elements
    const showLoginButton = document.getElementById('show-login');
    const showRegisterButton = document.getElementById('show-register');
    const showProviderRegisterButton = document.getElementById('show-provider-register');

    const VALID_PROVIDER_IDS = [
        'PROV001',
        'PROV002',
        'PROV003',
        'PROV004',
        'PROV005',
    ];

    // Function to get existing users from local storage
    function getUsersFromLocalStorage(isProvider = false) {
        const storageKey = isProvider ? 'registeredProviders' : 'registeredUsers';
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }

    // Function to save users to local storage
    function saveUsersToLocalStorage(users, isProvider = false) {
        const storageKey = isProvider ? 'registeredProviders' : 'registeredUsers';
        localStorage.setItem(storageKey, JSON.stringify(users));
    }

    // Form Switch Functionality
    showLoginButton.addEventListener('click', function() {
        showLoginButton.classList.add('active');
        showRegisterButton.classList.remove('active');
        showProviderRegisterButton.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        ProviderRegisterForm.style.display = 'none';
    });

    showRegisterButton.addEventListener('click', function() {
        showRegisterButton.classList.add('active');
        showLoginButton.classList.remove('active');
        showProviderRegisterButton.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        ProviderRegisterForm.style.display = 'none';
    });

    showProviderRegisterButton.addEventListener('click', function() {
        showProviderRegisterButton.classList.add('active');
        showLoginButton.classList.remove('active');
        showRegisterButton.classList.remove('active');
        ProviderRegisterForm.style.display = 'block';
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
    });

    // Mission Button Toggle
    missionButton.addEventListener('click', function() {
        if (missionStatement.classList.contains('show')) {
            missionStatement.classList.remove('show');
            missionStatement.style.maxHeight = null;
        } else {
            missionStatement.classList.add('show');
            missionStatement.style.maxHeight = missionStatement.scrollHeight + 'px';
        }
    });

    // Form Button Toggle
    formButton.addEventListener('click', function() {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
        } else {
            formContainer.style.display = 'none';
        }
    });

    // Authentication Modal Functionality
    loginToggle.addEventListener('click', function() {
        loginModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        loginModal.style.display = 'none';
        resetForms();
    });

    // Close modal if clicked outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            resetForms();
        }
    });

    // Login Form Submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Retrieve registered users and providers
        const registeredUsers = getUsersFromLocalStorage();
        const registeredProviders = getUsersFromLocalStorage(true);

        // Check if user exists and password matches in either users or providers
        const user = registeredUsers.find(u =>
            u.username === username && u.password === password
        );

        const provider = registeredProviders.find(u =>
            u.username === username && u.password === password
        );

        if (user || provider) {
            authMessage.textContent = 'Login Successful!';
            authMessage.style.color = 'green';

            // Hide modal after successful login
            setTimeout(() => {
                loginModal.style.display = 'none';
                resetForms();
            }, 1500);
        } else {
            authMessage.textContent = 'Invalid Username or Password';
            authMessage.style.color = 'red';
        }
    });

    // Regular User Registration Form Submission
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Basic registration validation
        if (password !== confirmPassword) {
            authMessage.textContent = 'Passwords do not match';
            authMessage.style.color = 'red';
            return;
        }

        if (username.length < 3) {
            authMessage.textContent = 'Username must be at least 3 characters long';
            authMessage.style.color = 'red';
            return;
        }

        // Retrieve existing users
        const registeredUsers = getUsersFromLocalStorage();

        // Check if username already exists in users
        if (registeredUsers.some(u => u.username === username)) {
            authMessage.textContent = 'Username already exists';
            authMessage.style.color = 'red';
            return;
        }

        // Check if username already exists in providers
        const registeredProviders = getUsersFromLocalStorage(true);
        if (registeredProviders.some(u => u.username === username)) {
            authMessage.textContent = 'Username already exists';
            authMessage.style.color = 'red';
            return;
        }

        // Create new user object
        const newUser = {
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Add new user to the array
        registeredUsers.push(newUser);

        // Save updated users to local storage
        saveUsersToLocalStorage(registeredUsers);

        authMessage.textContent = 'Registration Successful!';
        authMessage.style.color = 'green';

        // Hide modal after successful registration
        setTimeout(() => {
            loginModal.style.display = 'none';
            resetForms();
        }, 1500);
    });

    // Provider Registration Form Submission
    ProviderRegisterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const providerId = document.getElementById('provider-id').value.trim().toUpperCase();
        const username = document.getElementById('provider-username').value;
        const email = document.getElementById('provider-email').value;
        const password = document.getElementById('provider-password').value;
        const confirmPassword = document.getElementById('provider-confirm-password').value;

        // Basic registration validation
        if (password !== confirmPassword) {
            authMessage.textContent = 'Passwords do not match';
            authMessage.style.color = 'red';
            return;
        }

        if (username.length < 3) {
            authMessage.textContent = 'Username must be at least 3 characters long';
            authMessage.style.color = 'red';
            return;
        }

        // Validate Provider IDs
        if (!VALID_PROVIDER_IDS.includes(providerId)) {
            authMessage.textContent = 'Invalid Provider ID.';
            authMessage.style.color = 'red';
            return;
        }

        // Retrieve existing providers and users
        const registeredProviders = getUsersFromLocalStorage(true);
        const registeredUsers = getUsersFromLocalStorage();

        // Check if username already exists in providers
        if (registeredProviders.some(u => u.username === username)) {
            authMessage.textContent = 'Username already exists';
            authMessage.style.color = 'red';
            return;
        }

        // Check if username already exists in users
        if (registeredUsers.some(u => u.username === username)) {
            authMessage.textContent = 'Username already exists';
            authMessage.style.color = 'red';
            return;
        }

        //Check if Provider ID is already used
        if (registeredProviders.some(u => u.providerId === providerId)) {
            authMessage.textContent = 'Provider ID already registered';
            authMessage.style.color = 'red';
            return;
        }

        // Create new provider user object
        const newProviderUser = {
            username: username,
            email: email,
            password: password,
            providerId: providerId,
            createdAt: new Date().toISOString()
        };

        // Add new provider to the array
        registeredProviders.push(newProviderUser);
        saveUsersToLocalStorage(registeredProviders, true);

        authMessage.textContent = 'Provider Registration Successful!';
        authMessage.style.color = 'green';

        // Hide modal after successful registration
        setTimeout(() => {
            loginModal.style.display = 'none';
            resetForms();
        }, 1500);
    });

    // Reset forms to default state
    function resetForms() {
        // Reset all input fields
        loginForm.reset();
        registerForm.reset();
        ProviderRegisterForm.reset();

        // Reset message
        authMessage.textContent = '';

        // Show login form by default
        showLoginButton.classList.add('active');
        showRegisterButton.classList.remove('active');
        showProviderRegisterButton.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        ProviderRegisterForm.style.display = 'none';
    }
});