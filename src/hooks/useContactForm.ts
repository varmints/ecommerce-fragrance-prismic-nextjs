import { useState } from "react";
import { UseFormReset } from "react-hook-form";

export interface FormInputs {
  name: string;
  email: string;
  message: string;
}

export interface FormLabels {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitText: string;
  loadingText: string;
  successMessage: string;
}

interface UseContactFormProps {
  successMessage?: string;
  resetForm: UseFormReset<FormInputs>;
}

export const useContactForm = ({
  successMessage,
  resetForm,
}: UseContactFormProps) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const submit = async (data: FormInputs) => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        setMessage(
          successMessage ||
            "Your message has been sent successfully. Thank you for contacting us!",
        );
        resetForm();
      } else {
        const errorData = await response.json();
        setStatus("error");
        setMessage(
          errorData.error || "An error occurred while sending your message.",
        );
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return {
    submit,
    isSubmitting: status === "loading",
    message,
    status,
  };
};
