import * as Utils from "./../../Utils.js";
import { Test } from "./../../../Infractructure/DataBase/index.js";

export const CreateTest = async (req, res) => {
  try {
    const { title, exercises } = req.body;

    const parsedExercises = Utils.parsedExercises_AddSlug(exercises);

    Utils.ApplyFilesToExercises(req.files, parsedExercises);

    const test = await Test.Add({
      title,
      author: req.userId,
      exercises: parsedExercises,
    });

    res.status(201).json({
      success: true,
      id: test._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Помилка при створенні тесту",
      error: err.message,
    });
  }
};

export const GetTest = async (req, res) => {
  try {
    const testid = req.params.id;

    if (!Test.isValidId(testid)) {
      return res.status(400).json({ message: "Невірний код тесту" });
    }

    const test = await Test.GetOne(
      { _id: testid },
      [
        "-exercises.correctAnswers",
        "-exercises.answers.correct",
        "-exercises.pairs.correctMap",
        "-childrens",
      ].join(" "),
    );

    if (!test) {
      return res.status(404).json({ message: "Тест не знайдено" });
    }

    const shuffledExercises = Utils.ShuffleArray(test.exercises);

    res.json({
      ...test,
      exercises: shuffledExercises,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Помилка сервера",
      error: err.message,
    });
  }
};

export const CheckTest = async (req, res) => {
  try {
    const { userAnswers, name, leaveCount } = req.body;
    const testid = req.params.id;

    if (!name) {
      return res.status(400).json({ message: "Невірно вказане ім'я" });
    }

    if (!Test.isValidId(testid)) {
      return res.status(400).json({ message: "Невірний код тесту" });
    }

    const test = await Test.GetOne({ _id: testid }, "exercises");

    if (!test) {
      return res.status(404).json({ message: "Тест не знайдено" });
    }

    const exBal = 100 / test.exercises.length;

    const finalScore = Number(
      Utils.CheckAnswers(test.exercises, userAnswers, exBal).toFixed(2),
    );

    await Test.Update(test._id, {
      childrens: {
        slug: `child${test.childrens.length}`,
        name,
        scor: finalScore,
        leaveCount,
        userAnswer: userAnswers,
      },
    });

    res.json({
      success: true,
      score: finalScore,
      max: 100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Помилка сервера",
      error: err.message,
    });
  }
};

export const CheckChildTest = async (req, res) => {
  try {
    const { testId, childSlug } = req.params;

    if (!Test.isValidId(testId)) {
      return res.status(400).json({ message: "Невірний код тесту" });
    }

    const test = await Test.GetOne({ _id: testId });
    if (!test) return res.status(404).json({ message: "Тест не знайдено" });

    const childResult = test.childrens.find(
      (c) => String(c.slug) === childSlug,
    );
    if (!childResult)
      return res.status(404).json({ message: "Результат учня не знайдено" });

    const results = Utils.GetTestResults(test, childResult.userAnswer);

    res.json({
      name: childResult.name,
      score: childResult.scor,
      leaveCount: childResult.leaveCount,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Помилка сервера",
      error: err.message,
    });
  }
};

export const GetOneTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.GetOne({ _id: testId });

    if (!test) {
      return res.status(404).json({ message: "Тест не знайдено" });
    }

    res.json({
      test,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Помилка сервера",
      error: err.message,
    });
  }
};

export const Remove = async (req, res) => {
  try {
    const testId = req.params.id;

    const doc = await Test.Remove(testId);

    if (!doc) {
      return res.status(404).json({
        message: "Тест не знайдений",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося видалити тест",
    });
  }
};

export const Update = async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const { id } = req.params; // id тесту з маршруту

    const parsedExercises = Utils.parsedExercises_AddSlug(exercises);

    Utils.ApplyFilesToExercises(req.files, parsedExercises);

    const updatedTest = await Test.Update(id, {
      title,
      exercises: parsedExercises,
    });

    if (!updatedTest) {
      return res.status(404).json({ message: "Тест не знайдено" });
    }

    res.json({ success: true, id: updatedTest._id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Помилка при оновленні тесту", error: err.message });
  }
};
