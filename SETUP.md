# Resume Review Platform Setup Guide

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Configuration
ADMIN_USER_IDS=admin1@example.com,admin2@example.com

# Optional: Custom Supabase Functions URL
SUPABASE_FUNCTIONS_URL=https://your-project-ref.supabase.co/functions/v1
```

## Email Configuration

For email notifications to work, you need to:

1. **Get a Resend API Key:**
   - Sign up at [resend.com](https://resend.com)
   - Create an API key

2. **Set the Resend API Key as a Supabase Secret:**
   ```bash
   npx supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

3. **Deploy the Edge Function:**
   ```bash
   npx supabase functions deploy send-status-email
   ```

## Admin Configuration

Make sure to add your email to the `ADMIN_USER_IDS` in `.env.local`:

```bash
ADMIN_USER_IDS=your-email@example.com,another-admin@example.com
```

**Important:** The email must match exactly with the email you use to log in to the platform.

## Admin Review Process

The admin review submission now:

1. ✅ Updates the resume status, score, and notes in the database
2. ✅ Sends email notifications to users when their resume status changes
3. ✅ Redirects to the admin resumes page with success confirmation
4. ✅ Shows error messages if something goes wrong
5. ✅ Uses proper authentication for Edge Function calls
6. ✅ Uses client-side form submission with proper session handling

## Troubleshooting

### Email Not Sending
- Check that `RESEND_API_KEY` is set as a Supabase secret
- Verify the Edge Function is deployed
- Check Supabase function logs for errors
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

### Table Not Updating
- Check browser network tab for API errors
- Verify admin authentication is working
- Check Supabase database permissions

### Admin Access Issues
- Ensure your email is listed in `ADMIN_USER_IDS`
- Check that you're logged in with the correct account
