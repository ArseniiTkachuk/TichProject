import { SendEmail } from "./../../Infractructure/SendMail/index.js";

export default (code, email) => {
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
      Підтвердження email
    </h2>

    <p style="font-size: 15px; line-height: 1.6;">
      Ви намагаєтесь підтвердити свій email.  
      Введіть код нижче, щоб завершити реєстрацію:
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
      ${code}
    </div>

    <p style="font-size: 14px; color: #666;">
      Код дійсний <strong>10 хвилин</strong>.
    </p>

    <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 24px 0;">

    <p style="font-size: 14px; color: #999;">
      Якщо ви не реєструвалися — просто проігноруйте цей лист.
    </p>

  </div>
`,
    `Код підтвердження: ${code}`,
    "Підтвердження email",
    "TestName",
    "arsenii.tkachuk@kpk-lp.com.ua",
    email,
  );
};
