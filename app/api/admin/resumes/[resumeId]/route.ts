import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const resumeId = pathname.split('/').pop();

  if (!resumeId) {
    return NextResponse.json({ error: "Resume ID not found in URL" }, { status: 400 });
  }

  const userClient = getSupabaseServerClient();
  const { data: { user } } = await userClient.auth.getUser();

  if (!user || !isAdminUser(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { status, score, notes } = await request.json();
  const numericScore = score ? Number(score) : null;

  const { data: updatedRow, error } = await supabaseAdmin
    .from("resumes")
    .update({ status, notes, score: numericScore })
    .eq("id", resumeId)
    .select("user_id")
    .maybeSingle();

  if (error) {
    console.error('Supabase admin update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!updatedRow || !updatedRow.user_id) {
    return NextResponse.json({ success: true, message: 'Review updated, but no user found for notification.' });
  }
  
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(updatedRow.user_id);
  
  const email = userData?.user?.email ?? null;

  const wantsEmail = userData?.user?.user_metadata?.email_notifications_enabled ?? true;
  
  if (email && wantsEmail) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
      const mailOptions = {
        from: `"Resume Reviewer" <${process.env.EMAIL_SERVER_USER}>`,
        to: email,
        subject: `Your resume status: ${status}`,
        html: `<div>
          <p>Hi,</p>
          <p>Your resume status has been updated to <strong>${status}</strong>.</p>
          ${score ? `<p><strong>Score:</strong> ${score}</p>` : ''}
          ${notes ? `<p><strong>Notes:</strong></p><pre style="white-space: pre-wrap; font-family: inherit;">${notes}</pre>` : ""}
          <p>Thanks for using the Resume Reviewer platform.</p>
        </div>`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email notification sent to ${email} via Nodemailer.`);

    } catch (emailError) {
      console.error('Error sending email with Nodemailer:', emailError);
    }
  } else if (email && !wantsEmail) {
    console.log(`User ${email} has notifications turned off. Skipping email.`);
  }

  return NextResponse.json({ success: true, message: 'Review updated successfully' });
}