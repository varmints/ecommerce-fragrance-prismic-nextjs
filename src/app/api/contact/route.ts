import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactEmail } from "@/components/ContactEmail";
import { ConfirmationEmail } from "@/components/ConfirmationEmail";
import { createClient } from "@/prismicio";
import { getCurrentLocale } from "@/utils/locale";
import { contactFormLimiter, getClientIdentifier } from "@/utils/rateLimiter";
import { validateContactForm } from "@/utils/validation";
import { withSecurityHeaders, withCORS } from "@/utils/security";

const resend = new Resend(process.env.RESEND_API_KEY);

// Handle CORS preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return withCORS(withSecurityHeaders(response));
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check
    const clientId = getClientIdentifier(req);
    const rateLimitResult = contactFormLimiter.check(clientId);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          error: "Too many contact form submissions. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter?.toString() || "900",
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        },
      );

      return withCORS(withSecurityHeaders(response));
    }

    // 2. Parse and validate input
    const body = await req.json().catch(() => null);

    if (!body) {
      const response = NextResponse.json(
        { error: "Invalid JSON data" },
        { status: 400 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    const validation = validateContactForm(body);

    if (!validation.success) {
      const response = NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    const { name, email, message } = validation.data!;

    // 3. Get locale for email configuration
    const { prismicLang } = await getCurrentLocale();

    if (!prismicLang) {
      const response = NextResponse.json(
        { error: "Language configuration error" },
        { status: 500 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    // 4. Get email settings from Prismic
    const client = createClient();
    let settings;

    try {
      settings = await client.getSingle("settings", {
        lang: prismicLang,
      });
    } catch (error) {
      console.error("Failed to fetch settings from Prismic:", error);
      const response = NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    const {
      recipient_email,
      email_subject_template,
      confirmation_email_subject,
    } = settings.data.contact_form_settings[0] || {};

    if (!recipient_email) {
      console.error("Recipient email is not configured in Prismic settings.");
      const response = NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    // 5. Prepare email content
    const subject =
      email_subject_template?.replace("{{name}}", name) ||
      `Contact form message from ${name}`;
    const confirmationSubject =
      confirmation_email_subject || "Thank you for contacting us";

    // 6. Send emails
    const { error: ownerEmailError } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: [recipient_email],
      subject,
      replyTo: email,
      react: await ContactEmail({ name, email, message }),
      headers: {
        "X-Entity-Ref-ID": `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
    });

    if (ownerEmailError) {
      console.error("Failed to send email to owner:", ownerEmailError);
      const response = NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 },
      );
      return withCORS(withSecurityHeaders(response));
    }

    // Send confirmation email (non-blocking - if this fails, still return success)
    resend.emails
      .send({
        from: "Cote Royale <onboarding@resend.dev>",
        to: [email],
        subject: confirmationSubject,
        react: await ConfirmationEmail({ name }),
        headers: {
          "X-Entity-Ref-ID": `confirmation-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      })
      .catch((error) => {
        console.error("Failed to send confirmation email:", error);
        // Don't fail the request if confirmation email fails
      });

    // 7. Success response with rate limit headers
    const response = NextResponse.json(
      { message: "Message sent successfully" },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      },
    );

    return withCORS(withSecurityHeaders(response));
  } catch (error) {
    console.error("Unexpected error in contact API:", error);
    const errorResponse = NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );

    return withCORS(withSecurityHeaders(errorResponse));
  }
}
