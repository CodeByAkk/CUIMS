/**
 * CUIMS Student Login & Dashboard Controller
 * With full browser History API (back/forward) navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Screens ──────────────────────────────────────────────
  const screenLogin     = document.getElementById('screen-login');
  const screenDashboard = document.getElementById('screen-dashboard');
  const screenProfile   = document.getElementById('screen-profile');
  const screenAcademics = document.getElementById('screen-academics');
  const screenAccounts  = document.getElementById('screen-accounts');

  const allScreens = {
    login:     screenLogin,
    dashboard: screenDashboard,
    profile:   screenProfile,
    academics: screenAcademics,
    accounts:  screenAccounts
  };

  // ── History / Screen Navigation ──────────────────────────

  /**
   * Show the requested screen and hide all others.
   * If pushState=true, push a new browser history entry.
   */
  function showScreen(name, pushState = true) {
    Object.entries(allScreens).forEach(([key, el]) => {
      if (!el) return;
      if (key === name) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pushState) {
      history.pushState({ screen: name }, '', `#${name}`);
    }
  }

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', (e) => {
    const screen = (e.state && e.state.screen) ? e.state.screen : 'login';
    showScreen(screen, false); // false = don't push again

    // If going back to login, also close modal & reset form
    if (screen === 'login') {
      closeModal();
      resetToStepOne();
      if (inputPassword) inputPassword.value = '';
    }
  });

  // On first load, set the initial history state
  const initialHash = location.hash.replace('#', '') || 'login';
  const validScreens = ['login', 'dashboard', 'profile', 'academics', 'accounts'];
  const startScreen = validScreens.includes(initialHash) ? initialHash : 'login';
  history.replaceState({ screen: startScreen }, '', `#${startScreen}`);
  showScreen(startScreen, false);

  // ── Modal elements ────────────────────────────────────────
  const loginModalOverlay  = document.getElementById('login-modal-overlay');
  const btnOpenStudentLogin = document.getElementById('btn-open-student-login');
  const btnCloseModal      = document.getElementById('btn-close-modal');

  // ── Step panels ───────────────────────────────────────────
  const stepUidWrap      = document.getElementById('step-uid-wrap');
  const stepPasswordWrap = document.getElementById('step-password-wrap');
  const badgeActiveUid   = document.getElementById('badge-active-uid');
  const btnBackUid       = document.getElementById('btn-back-uid');

  // ── Inputs & Errors ───────────────────────────────────────
  const inputUid       = document.getElementById('input-uid');
  const inputPassword  = document.getElementById('input-password');
  const uidErrorMsg    = document.getElementById('uid-error-msg');
  const pwdErrorMsg    = document.getElementById('pwd-error-msg');
  const btnStepNext    = document.getElementById('btn-step-next');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const btnTogglePwd   = document.getElementById('btn-toggle-pwd');
  const loginForm      = document.getElementById('student-login-form');

  // ── Dashboard elements ────────────────────────────────────
  const displayDashboardUid = document.getElementById('display-dashboard-uid');
  const btnLogout           = document.getElementById('btn-logout');

  // ── Profile elements ──────────────────────────────────────
  const btnOpenProfile      = document.getElementById('btn-open-profile');
  const btnBackToDashboard  = document.getElementById('btn-back-to-dashboard');
  const btnLogoutProfile    = document.getElementById('btn-logout-profile');

  // ─────────────────────────────────────────────────────────
  // MODAL
  // ─────────────────────────────────────────────────────────

  function openModal() {
    loginModalOverlay.classList.remove('hidden');
    resetToStepOne();
    inputUid.focus();
  }

  function closeModal() {
    if (loginModalOverlay) loginModalOverlay.classList.add('hidden');
    resetToStepOne();
  }

  if (btnOpenStudentLogin) {
    btnOpenStudentLogin.addEventListener('click', openModal);
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  // Click outside modal card to close
  if (loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (e) => {
      if (e.target === loginModalOverlay) closeModal();
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModalOverlay && !loginModalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  // ─────────────────────────────────────────────────────────
  // LOGIN STEPS
  // ─────────────────────────────────────────────────────────

  function resetToStepOne() {
    if (stepUidWrap)      stepUidWrap.classList.remove('hidden');
    if (stepPasswordWrap) stepPasswordWrap.classList.add('hidden');
    if (uidErrorMsg)      uidErrorMsg.classList.add('hidden');
    if (pwdErrorMsg)      pwdErrorMsg.classList.add('hidden');
    if (inputPassword)    inputPassword.value = '';
  }

  function handleNextStep() {
    const uidVal = inputUid.value.trim();
    if (!uidVal) {
      uidErrorMsg.textContent = 'Please enter your User ID.';
      uidErrorMsg.classList.remove('hidden');
      inputUid.focus();
      return;
    }
    uidErrorMsg.classList.add('hidden');
    badgeActiveUid.textContent = uidVal;
    stepUidWrap.classList.add('hidden');
    stepPasswordWrap.classList.remove('hidden');
    pwdErrorMsg.classList.add('hidden');
    inputPassword.focus();
  }

  if (btnStepNext) {
    btnStepNext.addEventListener('click', handleNextStep);
  }

  if (inputUid) {
    inputUid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); handleNextStep(); }
    });
  }

  if (btnBackUid) {
    btnBackUid.addEventListener('click', () => {
      stepPasswordWrap.classList.add('hidden');
      stepUidWrap.classList.remove('hidden');
      inputUid.focus();
    });
  }

  // Toggle Password Visibility
  if (btnTogglePwd) {
    btnTogglePwd.addEventListener('click', () => {
      const isPassword = inputPassword.getAttribute('type') === 'password';
      inputPassword.setAttribute('type', isPassword ? 'text' : 'password');
      btnTogglePwd.style.color = isPassword ? '#ef233c' : '#9ca3af';
    });
  }

  // ─────────────────────────────────────────────────────────
  // LOGIN SUBMIT → DASHBOARD
  // ─────────────────────────────────────────────────────────

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const uidVal = inputUid.value.trim();
      const pwdVal = inputPassword.value;

      if (!pwdVal) {
        pwdErrorMsg.textContent = 'Please enter your password.';
        pwdErrorMsg.classList.remove('hidden');
        inputPassword.focus();
        return;
      }

      const isValid = (uidVal.toUpperCase() === '26BCS12924' && pwdVal === 'Anmol@#1212') ||
                      (uidVal && pwdVal === 'Anmol@#1212') ||
                      (uidVal && pwdVal);

      if (!isValid) {
        pwdErrorMsg.textContent = 'Invalid credentials. Please verify your password.';
        pwdErrorMsg.classList.remove('hidden');
        inputPassword.focus();
        return;
      }

      pwdErrorMsg.classList.add('hidden');
      btnSubmitLogin.textContent = 'LOGGING IN...';
      btnSubmitLogin.disabled = true;

      setTimeout(() => {
        btnSubmitLogin.textContent = 'LOG IN';
        btnSubmitLogin.disabled = false;

        if (displayDashboardUid) {
          displayDashboardUid.textContent = uidVal ? uidVal.toUpperCase() : '26BCS12924';
        }

        closeModal();
        showScreen('dashboard'); // pushes #dashboard into history
      }, 350);
    });
  }

  // ─────────────────────────────────────────────────────────
  // LOGOUT → LOGIN
  // ─────────────────────────────────────────────────────────

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      resetToStepOne();
      showScreen('login'); // pushes #login into history
    });
  }

  if (btnLogoutProfile) {
    btnLogoutProfile.addEventListener('click', () => {
      resetToStepOne();
      showScreen('login'); // pushes #login into history
    });
  }

  // ─────────────────────────────────────────────────────────
  // DASHBOARD ↔ PROFILE
  // ─────────────────────────────────────────────────────────

  if (btnOpenProfile) {
    btnOpenProfile.addEventListener('click', () => {
      showScreen('profile'); // pushes #profile into history
    });
  }

  if (btnBackToDashboard) {
    btnBackToDashboard.addEventListener('click', () => {
      showScreen('dashboard'); // pushes #dashboard into history
    });
  }

  // ─────────────────────────────────────────────────────────
  // REGISTRATION BUTTONS
  // ─────────────────────────────────────────────────────────

  const btnRegistration  = document.getElementById('btn-registration');
  const btnRegistration2 = document.getElementById('btn-registration-2');
  [btnRegistration, btnRegistration2].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        alert('Student registration portal is currently closed for the semester.');
      });
    }
  });

  // ─────────────────────────────────────────────────────────
  // SIDEBAR NAVIGATION DRAWER TOGGLE
  // ─────────────────────────────────────────────────────────
  const hamburgerButtons = document.querySelectorAll('.hamburger-btn');
  const sidebarBackdrops = document.querySelectorAll('.sidebar-backdrop');
  const sidebarLinks     = document.querySelectorAll('.sidebar-link');

  function toggleDrawer() {
    const mainLayouts = document.querySelectorAll('.dashboard-main-layout');
    mainLayouts.forEach(layout => {
      layout.classList.toggle('drawer-open');
    });
  }

  function closeDrawer() {
    const mainLayouts = document.querySelectorAll('.dashboard-main-layout');
    mainLayouts.forEach(layout => {
      layout.classList.remove('drawer-open');
    });
  }

  hamburgerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });
  });

  sidebarBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      closeDrawer();
    });
  });

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = (link.querySelector('.sidebar-link-text')?.textContent || '').trim().toLowerCase();
      const screenAttr = link.getAttribute('data-screen');

      closeDrawer();

      if (screenAttr === 'accounts' || text === 'accounts' || text === 'account') {
        showScreen('accounts');
      } else if (screenAttr === 'academics' || text === 'academics') {
        showScreen('academics');
      }
    });
  });

  // Home / Logo clicks back to dashboard
  document.querySelectorAll('.btn-nav-home').forEach(btn => {
    btn.addEventListener('click', () => {
      closeDrawer();
      showScreen('dashboard');
    });
  });

  // Profile clicks
  document.querySelectorAll('.btn-nav-profile').forEach(btn => {
    btn.addEventListener('click', () => {
      closeDrawer();
      showScreen('profile');
    });
  });

});
