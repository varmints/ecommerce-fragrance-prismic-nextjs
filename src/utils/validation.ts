import { z } from "zod";

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .refine(
      (name) => name.length > 0,
      "Name cannot be empty or contain only whitespace",
    ),

  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(254, "Email must be less than 254 characters")
    .toLowerCase()
    .trim(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .refine(
      (message) => message.replace(/\s+/g, " ").length >= 10,
      "Message must contain meaningful content",
    ),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// Additional validation helpers
export const ValidationHelpers = {
  /**
   * Check if string contains potentially malicious content
   */
  containsSuspiciousContent: (text: string): boolean => {
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
      /javascript:/gi, // Javascript URLs
      /data:text\/html/gi, // Data URLs
      /on\w+\s*=/gi, // Event handlers
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframes
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(text));
  },

  /**
   * Basic HTML sanitization (removes common XSS vectors)
   */
  sanitizeText: (text: string): string => {
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .trim();
  },

  /**
   * Check for spam-like content
   */
  isSpamLike: (text: string): boolean => {
    const spamIndicators = [
      /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/gi,
      /https?:\/\/[^\s]+/g, // Multiple URLs
      /(.)\1{4,}/g, // Repeated characters
      /[A-Z]{10,}/g, // Excessive caps
    ];

    const urlCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;
    if (urlCount > 2) return true;

    return spamIndicators.some((pattern) => {
      const matches = text.match(pattern);
      return matches && matches.length > 0;
    });
  },

  /**
   * Enhanced email validation beyond basic regex
   */
  isValidEmailDomain: (email: string): boolean => {
    const domain = email.split("@")[1];
    if (!domain) return false;

    // Check for common spam/temporary email domains
    const suspiciousDomains = [
      "10minutemail.com",
      "tempmail.org",
      "guerrillamail.com",
      "mailinator.com",
    ];

    return !suspiciousDomains.includes(domain.toLowerCase());
  },
};

/**
 * Comprehensive validation function that combines Zod with additional checks
 */
export function validateContactForm(data: unknown): {
  success: boolean;
  data?: ContactFormData;
  errors?: string[];
} {
  try {
    // First, validate with Zod schema
    const parsed = ContactFormSchema.parse(data);

    const errors: string[] = [];

    // Additional security checks
    if (ValidationHelpers.containsSuspiciousContent(parsed.name)) {
      errors.push("Name contains suspicious content");
    }

    if (ValidationHelpers.containsSuspiciousContent(parsed.message)) {
      errors.push("Message contains suspicious content");
    }

    if (!ValidationHelpers.isValidEmailDomain(parsed.email)) {
      errors.push("Email domain is not allowed");
    }

    if (ValidationHelpers.isSpamLike(parsed.message)) {
      errors.push("Message appears to be spam");
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Sanitize the data
    const sanitizedData: ContactFormData = {
      name: ValidationHelpers.sanitizeText(parsed.name),
      email: parsed.email, // Email is already validated
      message: ValidationHelpers.sanitizeText(parsed.message),
    };

    return { success: true, data: sanitizedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      return { success: false, errors };
    }

    return { success: false, errors: ["Invalid input data"] };
  }
}
