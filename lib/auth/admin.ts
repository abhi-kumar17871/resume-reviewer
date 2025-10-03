export function isAdminUser(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  
  const adminEmails = process.env.ADMIN_USER_IDS?.split(',').map(email => email.trim().toLowerCase()) || [];
  
  // Fallback to hardcoded admin if no env var is set
  if (adminEmails.length === 0) {
    adminEmails.push("admin@gmail.com");
  }
  
  return adminEmails.includes(userEmail.toLowerCase());
}


