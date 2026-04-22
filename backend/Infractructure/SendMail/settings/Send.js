import sendpulse from "./initiator.js";

export default (html, text, subject, from_name, from_email, to_email) => {
  const emailData = {
    html: html,
    text: text,
    subject: subject,
    from: { name: from_name, email: from_email },
    to: [{ email: to_email }],
  };

  // Використовуємо вже ініціалізований sendpulse
  sendpulse.smtpSendMail((response) => {
    console.log("Email Sent:", response);
  }, emailData);
};
