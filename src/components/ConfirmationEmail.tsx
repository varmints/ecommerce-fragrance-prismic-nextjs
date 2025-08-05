import React from 'react';

interface ConfirmationEmailProps {
  name: string;
}

export const ConfirmationEmail: React.FC<Readonly<ConfirmationEmailProps>> = ({
  name,
}) => (
  <div>
    <h1>Dziękujemy za kontakt, {name}!</h1>
    <p>
      Otrzymaliśmy Twoją wiadomość i wkrótce się z Tobą skontaktujemy.
    </p>
    <p>
      Pozdrawiamy,
      <br />
      Zespół Cote Royale
    </p>
  </div>
);

export default ConfirmationEmail;
