"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";
import { FaSpinner } from "react-icons/fa";
import { useContactForm, FormInputs, FormLabels } from "@/hooks/useContactForm";

interface ContactFormProps {
  labels: FormLabels & {
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
  };
}

export const ContactForm = ({ labels }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();
  const { submit, isSubmitting, message, status } = useContactForm({
    successMessage: labels.successMessage,
    resetForm: reset,
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    submit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-200"
        >
          {labels.nameLabel} <span className="text-red-400">*</span>
        </label>
        <input
          {...register("name", { required: "Name is required." })}
          type="text"
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder={labels.namePlaceholder}
          className={clsx(
            "block w-full border px-4 py-3 text-white placeholder:text-gray-500",
            errors.name
              ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
              : "border-gray-600 hover:border-gray-500",
          )}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-400" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-200"
        >
          {labels.emailLabel} <span className="text-red-400">*</span>
        </label>
        <input
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address.",
            },
          })}
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder={labels.emailPlaceholder}
          className={clsx(
            "block w-full border px-4 py-3 text-white placeholder:text-gray-500",
            errors.email
              ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
              : "border-gray-600 hover:border-gray-500",
          )}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-200"
        >
          {labels.messageLabel} <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register("message", { required: "Message is required." })}
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder={labels.messagePlaceholder}
          className={clsx(
            "resize-vertical block w-full border px-4 py-3 text-white placeholder:text-gray-500",
            errors.message
              ? "border-red-500 focus:border-red-400 focus:ring-red-400/20"
              : "border-gray-600 hover:border-gray-500",
          )}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-400" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "inline-flex w-full cursor-pointer items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-all duration-300",
            "bg-white text-black hover:bg-white/90",
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white",
            isSubmitting && "scale-98",
          )}
          aria-describedby={message ? "form-feedback" : undefined}
        >
          {isSubmitting ? (
            <>
              <FaSpinner
                className="mr-3 -ml-1 h-5 w-5 animate-spin text-black"
                aria-hidden="true"
              />
              {labels.loadingText}
            </>
          ) : (
            labels.submitText
          )}
        </button>
      </div>

      {/* Form feedback messages */}
      {message && (
        <div
          id="form-feedback"
          className={clsx(
            "border p-4",
            status === "success"
              ? "border-green-700 bg-green-900/20 text-green-400"
              : "border-red-700 bg-red-900/20 text-red-400",
          )}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </form>
  );
};
