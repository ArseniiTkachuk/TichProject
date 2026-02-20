import { body } from "express-validator";

// валідація реєстрації
export const registerValidator = [
  body("email", "Неправильний формат адреси").isEmail(),
  body("password", "Пароль має складатися мінімум з 8 символів").isLength({
    min: 8,
  }),
  body("name", "Імя має складатися мінімум з 3 символів").isLength({ min: 3 }),
];

// валідація входу
export const loginValidator = [
  body("email", "Неправильний формат адреси").isEmail(),
  body("password", "Пароль має складатися мінімум з 8 символів").isLength({
    min: 8,
  }),
];

// валідація створення на редагування тесту
export const validateExercise = (ex) => {
  if (!ex.type || !ex.question) {
    return "Кожне питання повинно мати тип і текст";
  }

  /*  ONE  */
  if (ex.type === "one") {
    const correctCount = ex.answers?.filter((a) => a.correct).length || 0;
    if (correctCount !== 1) {
      return "Питання з однією відповіддю повинно мати рівно одну правильну";
    }
  }

  /*  MANY  */
  if (ex.type === "many") {
    const correctCount = ex.answers?.filter((a) => a.correct).length || 0;
    if (correctCount < 1) {
      return "Питання з кількома відповідями повинно мати хоча б одну правильну";
    }
  }

  /*  ENTER  */
  if (ex.type === "enter") {
    if (!ex.correctAnswers || ex.correctAnswers.length === 0) {
      return "Питання з введенням повинно мати хоча б одну правильну відповідь";
    }
  }

  /*  PAIR  */
  if (ex.type === "pair") {
    const { left, right, correctMap } = ex.pairs || {};

    if (!left?.length || !right?.length) {
      return "Пари повинні мати ліву і праву колонки";
    }

    if (right.length < left.length) {
      return "Правих варіантів повинно бути не менше ніж лівих";
    }

    const values = Object.values(correctMap);
    const hasDuplicates = values.some((v, i) => values.indexOf(v) !== i);
    if (hasDuplicates) {
      return "Некоректна відповідність між парами";
    }
  }

  return null;
};
