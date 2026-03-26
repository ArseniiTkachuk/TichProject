const ExerciseValidators = {
  one: (ex) => {
    const correctCount = ex.answers?.filter((a) => a.correct).length || 0;
    return correctCount === 1
      ? null
      : "Питання з однією відповіддю повинно мати рівно одну правильну";
  },
  many: (ex) => {
    const correctCount = ex.answers?.filter((a) => a.correct).length || 0;
    return correctCount >= 1
      ? null
      : "Питання з кількома відповідями повинно мати хоча б одну правильну";
  },
  enter: (ex) => {
    return ex.correctAnswers?.length > 0
      ? null
      : "Питання з введенням повинно мати хоча б одну правильну відповідь";
  },
  pair: (ex) => {
    const { left = [], right = [], correctMap = {} } = ex.pairs || {};
    if (left.length === 0 || right.length === 0)
      return "Пари повинні мати ліву і праву колонки";
    if (right.length < left.length)
      return "Правих варіантів має бути не менше ніж лівих";

    const mappedValues = Object.values(correctMap);
    const uniqueValues = new Set(mappedValues);
    return uniqueValues.size === mappedValues.length
      ? null
      : "Кожна пара має бути унікальною";
  },
};

export default (ex) => {
  // Базова перевірка для всіх типів
  if (!ex.type || !ex.question) return "Тип та текст питання обов'язкові";

  // Виклик конкретного валідатора за типом
  const validator = ExerciseValidators[ex.type];

  if (!validator) return `Невідомий тип завдання: ${ex.type}`;

  return validator(ex);
};
