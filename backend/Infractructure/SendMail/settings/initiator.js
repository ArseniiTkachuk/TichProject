import sendpulse from "sendpulse-api";
import dotenv from "dotenv";

dotenv.config();

// Ініціалізація виконується один раз при завантаженні файлу
sendpulse.init(
  process.env.SENDPULSE_API_ID,
  process.env.SENDPULSE_API_SECRET,
  "/tmp/",
);

// Експортуємо вже налаштований об'єкт
export default sendpulse;
