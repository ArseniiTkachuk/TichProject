import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// створюємо транспортер один раз
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// функція для відправки коду
export const sendVerificationCode = async (userEmail, userId, UserModel) => {
  // 1. Генеруємо код
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Хешуємо код
  const codeHash = await bcrypt.hash(code, 10);

  // 3. Зберігаємо хеш та час закінчення дії в базі
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв
  await UserModel.findByIdAndUpdate(userId, {
    emailCodeHash: codeHash,
    emailCodeExpires: expires
  });

  // 4. Відправляємо лист
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: userEmail,
    subject: "Підтвердження email",
    text: `Ваш код підтвердження: ${code}\nДійсний 10 хвилин`
  });
};
