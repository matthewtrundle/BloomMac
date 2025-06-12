# How to Debug the Startup Email Error

I've added enhanced error logging to help us find where the email error is coming from. 

## What I've Added:

1. **Error handler in next.config.ts** - This will catch the error early
2. **Debug logs in email modules** - To see which modules are loading
3. **Better error handling in resend-client.ts** - Fixed a potential null pointer issue

## To Find the Error:

1. Run your app again:
   ```bash
   PORT=3011 npm run dev
   ```

2. Look for these debug messages in the console:
   - `[EMAIL DEBUG]` - Shows which email modules are loading
   - `[EMAIL ERROR INTERCEPTED]` - Shows where the error is caught
   - `[UNCAUGHT EMAIL ERROR]` - Shows the full stack trace

3. The **stack trace** will show you exactly which file and line is trying to send an email with an undefined 'to' field.

## What to Look For:

The error is happening at startup, so look for:
- Any email code outside of functions (at the module level)
- Any component that sends emails in its body (not in useEffect or event handlers)
- Any initialization code that tries to send test emails

## Once You Find It:

Share the stack trace with me and I'll help you fix the specific issue.

## Temporary Workaround:

If you need to run the app immediately, you can set a dummy RESEND_API_KEY:
```bash
RESEND_API_KEY=re_dummy_key PORT=3011 npm run dev
```

This might bypass some initialization issues while we debug.