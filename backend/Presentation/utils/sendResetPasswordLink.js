import { SendEmail } from "./../../Infractructure/SendMail/index.js";

export default (resetUrl, email) => {
  SendEmail(
    `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
    padding: 24px;
    max-width: 480px;
    margin: 0 auto;
  ">

    <h2 style="margin-bottom: 12px;">
      Відновлення паролю
    </h2>

    <p style="font-size: 15px; line-height: 1.6;">
      Ви намагаєтесь відновити пароль.  
      Перейдіть за посиланням нище щоб скинути пароль:
    </p>

    <div style="
      font-size: 26px;
      font-weight: bold;
      margin: 20px 0;
      padding: 12px 0;
      text-align: center;
      background: #f5f5f5;
      border-radius: 6px;
      letter-spacing: 4px;
    ">
      <a href="${resetUrl}" style="
        color: #4ea1ff;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease;
      ">Скинути пароль</a>
    </div>

    <p style="font-size: 14px; color: #666;">
      Посилання дійсне <strong>10 хвилин</strong>.
    </p>

    <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 24px 0;">

    <p style="font-size: 14px; color: #999;">
      Якщо ви не реєструвалися — просто проігноруйте цей лист.
    </p>

  </div>
`,
    "Відновлення паролю",
    "Відновлення паролю",
    "TestHost",
    "arsenii.tkachuk@kpk-lp.com.ua",
    email,
  );
};
