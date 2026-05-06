let state = {
  user: null,
  isLoading: false,
  error: null,
  currentView: 'login'
};

const elements = {
  loginView: document.getElementById('login-view'),
  registerView: document.getElementById('register-view'),
  profileView: document.getElementById('profile-view'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  logoutBtn: document.getElementById('logout-btn'),
  messageContainer: document.getElementById('message-container'),
  loadingSpinner: document.getElementById('loading-spinner'),
  profileContent: document.getElementById('profile-content'),
  switchToRegister: document.getElementById('switch-to-register'),
  switchToLogin: document.getElementById('switch-to-login')
};

function updateAuthUI() {
  if (state.user) {
    elements.logoutBtn.classList.remove('hidden');
  } else {
    elements.logoutBtn.classList.add('hidden');
  }
}

function showMessage(text, type = 'error') {
  elements.messageContainer.innerHTML = `
    <div class="p-3 rounded ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
      ${text}
    </div>
  `;
  setTimeout(() => {
    elements.messageContainer.innerHTML = '';
  }, 5000);
}

function setLoading(loading) {
  state.isLoading = loading;
  elements.loadingSpinner.style.display = loading ? 'block' : 'none';

  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(btn => {
    btn.disabled = loading;
    if (loading) {
      if (!btn.dataset.originalText) {
        btn.dataset.originalText = btn.textContent;
      }
      btn.textContent = 'Loading...';
    } else {
      btn.textContent = btn.dataset.originalText || 'Submit';
    }
  });
}

function showView(viewName) {
  state.currentView = viewName;

  elements.loginView.classList.add('hidden');
  elements.registerView.classList.add('hidden');
  elements.profileView.classList.add('hidden');

  if (viewName === 'login') {
    elements.loginView.classList.remove('hidden');
  } else if (viewName === 'register') {
    elements.registerView.classList.remove('hidden');
  } else if (viewName === 'profile') {
    elements.profileView.classList.remove('hidden');
  }
}

function updateProfileUI(user) {
  elements.profileContent.innerHTML = `
    <div class="space-y-3">
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Role:</strong> ${user.role}</p>
      <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Updated:</strong> ${new Date(user.updatedAt).toLocaleString()}</p>
    </div>
  `;
}

async function checkAuthStatus() {
  setLoading(true);
  try {
    const userData = await getCurrentUser();
    state.user = userData.data;
    updateProfileUI(userData.data);
    updateAuthUI();
    showView('profile');
  } catch (error) {
    state.user = null;
    updateAuthUI();
    showView('login');
    if (error.message !== 'Failed to fetch user') {
      console.error('Auth check error:', error);
    }
  } finally {
    setLoading(false);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(elements.loginForm);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const response = await loginUser(data);
    state.user = response.data;
    updateProfileUI(response.data);
    updateAuthUI();
    showMessage('Login successful!', 'success');
    showView('profile');
    elements.loginForm.reset();
  } catch (error) {
    showMessage(error.message);
  } finally {
    setLoading(false);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(elements.registerForm);
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role') || 'USER'
  };

  try {
    const response = await registerUser(data);
    state.user = response.data;
    updateProfileUI(response.data);
    updateAuthUI();
    showMessage('Registration successful!', 'success');
    showView('profile');
    elements.registerForm.reset();
  } catch (error) {
    showMessage(error.message);
  } finally {
    setLoading(false);
  }
}

async function handleLogout(e) {
  e.preventDefault();
  setLoading(true);

  try {
    await logoutUser();
    state.user = null;
    updateAuthUI();
    showMessage('Logged out successfully', 'success');
    showView('login');
  } catch (error) {
    showMessage(error.message);
  } finally {
    setLoading(false);
  }
}

function init() {
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.registerForm.addEventListener('submit', handleRegister);
  elements.logoutBtn.addEventListener('click', handleLogout);

  if (elements.switchToRegister) {
    elements.switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showView('register');
    });
  }

  if (elements.switchToLogin) {
    elements.switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showView('login');
    });
  }

  updateAuthUI();
  checkAuthStatus();
}

document.addEventListener('DOMContentLoaded', init);
