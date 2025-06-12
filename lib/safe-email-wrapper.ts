// Safe wrapper for email operations to prevent startup errors

export function safeEmailSend(emailFunction: Function) {
  return async (...args: any[]) => {
    // Validate the first argument (usually the options object)
    if (args[0] && typeof args[0] === 'object') {
      const options = args[0];
      
      // Ensure 'to' field is valid
      if (!options.to || (typeof options.to !== 'string' && !Array.isArray(options.to))) {
        console.error('[SafeEmail] Invalid or missing "to" field:', options.to);
        throw new Error('Email recipient (to) is required and must be a string or array');
      }
      
      // If 'to' is an array, validate each element
      if (Array.isArray(options.to)) {
        options.to = options.to.filter((email: any) => {
          if (typeof email !== 'string' || !email.includes('@')) {
            console.error('[SafeEmail] Filtering out invalid email:', email);
            return false;
          }
          return true;
        });
        
        if (options.to.length === 0) {
          throw new Error('No valid email recipients provided');
        }
      }
    }
    
    try {
      return await emailFunction(...args);
    } catch (error) {
      console.error('[SafeEmail] Error sending email:', error);
      throw error;
    }
  };
}

// Safe initialization wrapper
export function safeInit<T>(initFunction: () => T, fallback: T): T {
  try {
    return initFunction();
  } catch (error) {
    console.error('[SafeInit] Initialization error:', error);
    return fallback;
  }
}