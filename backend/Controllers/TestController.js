import Test from '../models/test.js';
import mongoose from 'mongoose';

/* ================= HELPERS ================= */

const isValidIndex = (index, arr) =>
  Number.isInteger(index) && index >= 0 && index < arr.length;

const validateExercise = (ex) => {
  if (!ex.type || !ex.question) {
    return 'Кожне питання повинно мати тип і текст';
  }

  /* ---- ONE ---- */
  if (ex.type === 'one') {
    const correctCount = ex.answers?.filter(a => a.correct).length || 0;
    if (correctCount !== 1) {
      return 'Питання з однією відповіддю повинно мати рівно одну правильну';
    }
  }

  /* ---- MANY ---- */
  if (ex.type === 'many') {
    const correctCount = ex.answers?.filter(a => a.correct).length || 0;
    if (correctCount < 1) {
      return 'Питання з кількома відповідями повинно мати хоча б одну правильну';
    }
  }

  /* ---- ENTER ---- */
  if (ex.type === 'enter') {
    if (!ex.correctAnswers || ex.correctAnswers.length === 0) {
      return 'Питання з введенням повинно мати правильну відповідь';
    }
  }

  /* ---- PAIR ---- */
  if (ex.type === 'pair') {
    const { left, right, correctMap } = ex.pairs || {};

    if (!left?.length || !right?.length) {
      return 'Пари повинні мати ліву і праву колонки';
    }

    if (right.length < left.length) {
      return 'Правих варіантів повинно бути не менше ніж лівих';
    }

    for (let i = 0; i < left.length; i++) {
      const mappedIndex = Number(correctMap?.[i]);
      if (!isValidIndex(mappedIndex, right)) {
        return 'Некоректна відповідність у парах';
      }
    }
  }

  return null;
};

/* ================= CONTROLLER ================= */

export const createTest = async (req, res) => {
  try {
    const { title, exercises } = req.body;

    if (!title || !exercises) {
      return res.status(400).json({ message: 'Невалідні дані' });
    }

    let parsedExercises;
    try {
      parsedExercises = JSON.parse(exercises);
    } catch (err) {
      return res.status(400).json({
        message: 'Некоректний формат exercises'
      });
    }

    /* ===== VALIDATION ===== */
    for (const ex of parsedExercises) {
      const error = validateExercise(ex);
      if (error) {
        return res.status(400).json({ message: error });
      }
    }

    /* ===== IMAGES ===== */
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // очікуємо: images[q0][a1]
        const match = file.fieldname.match(/q(\d+)\]\[a(\d+)/);
        if (!match) return;

        const qIndex = Number(match[1]);
        const aIndex = Number(match[2]);

        const answer =
          parsedExercises[qIndex]?.answers?.[aIndex];

        if (answer) {
          answer.isImage = true;
          answer.imageUrl = `/uploads/${file.filename}`;
        }
      });
    }

    /* ===== SAVE ===== */
    const test = new Test({
      title,
      author: new mongoose.Types.ObjectId(req.userId),
      exercises: parsedExercises
    });

    await test.save();

    res.json({
      success: true,
      test
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Помилка при створенні тесту',
      error: err.message
    });
  }
};
