/**
 * Onboarding Debug Helper
 * Add this script to your pages to get detailed console logs during onboarding
 */

(function() {
  // Only run in development
  if (process.env.NODE_ENV === 'production') return;

  const originalFetch = window.fetch;
  const startTime = Date.now();

  // Helper to format time
  function getElapsedTime() {
    return ((Date.now() - startTime) / 1000).toFixed(2) + 's';
  }

  // Helper to log with styling
  function debugLog(message, type = 'info', data = null) {
    const styles = {
      info: 'color: #3B82F6; font-weight: bold;',
      success: 'color: #10B981; font-weight: bold;',
      error: 'color: #EF4444; font-weight: bold;',
      warning: 'color: #F59E0B; font-weight: bold;',
      api: 'color: #8B5CF6; font-weight: bold;'
    };

    console.log(
      `%c[Onboarding Debug ${getElapsedTime()}] ${message}`,
      styles[type] || styles.info,
      data || ''
    );
  }

  // Track current step
  let currentStep = 'unknown';
  const observer = new MutationObserver(() => {
    const stepElement = document.querySelector('[class*="Step"]:not([class*="hidden"])');
    if (stepElement) {
      const newStep = stepElement.className.match(/(\w+)Step/)?.[1] || 'unknown';
      if (newStep !== currentStep) {
        currentStep = newStep;
        debugLog(`Entered step: ${currentStep}`, 'info');
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Intercept fetch calls
  window.fetch = async function(...args) {
    const [url, options] = args;
    const method = options?.method || 'GET';
    const isOnboardingAPI = url.includes('/api/') && (
      url.includes('analytics') ||
      url.includes('newsletter') ||
      url.includes('achievements') ||
      url.includes('auth')
    );

    if (isOnboardingAPI) {
      debugLog(`API Call: ${method} ${url}`, 'api');
      if (options?.body) {
        try {
          const body = JSON.parse(options.body);
          debugLog('Request Body:', 'api', body);
        } catch (e) {
          // Not JSON
        }
      }
    }

    try {
      const response = await originalFetch(...args);
      
      if (isOnboardingAPI) {
        const clonedResponse = response.clone();
        const responseData = await clonedResponse.json().catch(() => null);
        
        if (response.ok) {
          debugLog(`API Success: ${response.status}`, 'success', responseData);
        } else {
          debugLog(`API Error: ${response.status}`, 'error', responseData);
        }
      }

      return response;
    } catch (error) {
      if (isOnboardingAPI) {
        debugLog(`API Exception: ${error.message}`, 'error');
      }
      throw error;
    }
  };

  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (!key.includes('password')) {
        data[key] = value;
      }
    }
    debugLog(`Form submitted in ${currentStep}`, 'info', data);
  }, true);

  // Track validation errors
  const originalSetError = window.setError;
  if (originalSetError) {
    window.setError = function(error) {
      debugLog(`Validation Error in ${currentStep}: ${error}`, 'error');
      return originalSetError(error);
    };
  }

  // Check auth status
  setInterval(() => {
    const authStatus = {
      hasUser: !!window.__user,
      hasSession: !!window.__session,
      hasSupabase: !!window.supabase
    };
    debugLog('Auth Status Check:', 'info', authStatus);
  }, 5000);

  debugLog('Onboarding Debug Helper Loaded', 'success');
  debugLog('This will log all API calls and form submissions', 'info');

  // Export for console access
  window.onboardingDebug = {
    getCurrentStep: () => currentStep,
    getElapsedTime,
    checkAuth: async () => {
      if (window.supabase) {
        const { data: { user } } = await window.supabase.auth.getUser();
        debugLog('Current User:', 'info', user);
        return user;
      }
      return null;
    }
  };
})();