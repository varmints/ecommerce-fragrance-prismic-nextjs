import React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  message,
}) => (
  <div>
    <h1>Wiadomość z formularza kontaktowego</h1>
    <p>
      Od: <strong>{name}</strong> ({email})
    </p>
    <h2>Wiadomość:</h2>
    <p>{message}</p>
  </div>
);

export default ContactEmail;
