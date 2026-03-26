import { body } from "express-validator";
import validateExercise from "./validateExercise.js";

export const TestValidation = [
  body("title", "Назва тесту занадто коротка").isLength({ min: 2 }),
  body("exercises", "Тест повинен містити хоча б одне питання").isArray({
    min: 1,
  }),

  // Кастомний валідатор для кожного питання в масиві
  body("exercises.*").custom((ex) => {
    const error = validateExercise(ex);
    if (error) {
      throw new Error(error);
    }
    return true;
  }),
];
