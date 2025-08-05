import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ContactForm as ContactFormComponent } from "@/components/ContactForm";

/**
 * Props for `ContactForm`.
 */
export type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

/**
 * Component for "ContactForm" Slices.
 */
const ContactForm = ({ slice }: ContactFormProps) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-8"
    >
      <ContactFormComponent
        labels={{
          nameLabel: slice.primary.name_label || "Name",
          emailLabel: slice.primary.email_label || "Email",
          messageLabel: slice.primary.message_label || "Message",
          namePlaceholder: slice.primary.name_field_placeholder || "Your name",
          emailPlaceholder:
            slice.primary.email_field_placeholder || "your@email.com",
          messagePlaceholder:
            slice.primary.message_field_placeholder || "Your message",
          submitText: slice.primary.submit_button_text || "Send Message",
          loadingText: slice.primary.loading_text || "Sending...",
          successMessage:
            slice.primary.success_message ||
            "Your message has been sent successfully. Thank you for contacting us!",
        }}
      />
    </section>
  );
};

export default ContactForm;
