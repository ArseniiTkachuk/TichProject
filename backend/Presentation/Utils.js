import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

export const bubbleSort = (arr) => {
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    // Останні i елементів вже на своїх місцях
    for (let j = 0; j < n - i - 1; j++) {
      // Порівнюємо сусідні елементи
      if (arr[j] > arr[j + 1]) {
        // Міняємо місцями
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
};

export const CreatePasswordHash = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const CheckPasswordHash = async (password, hash) => {
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (err) {
    console.error("CheckPasswordHash error:" + err);
    throw new Error("Помилка при перевірці хешу");
  }
};

export const CreateToken = (id) => {
  return jwt.sign({ _id: id }, process.env.TOKEN_KEY, {
    expiresIn: "30d",
  });
};

export const CheckAuthUser = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(401).json({
        message: "Нема доступа, спочатку зареєструйтесь",
      });
    }
  } else {
    return res.status(401).json({
      message: "Нема доступа, спочатку зареєструйтесь",
    });
  }
};

export const CreateRandomCode = (length) => {
  if (length <= 0) return "";

  // Визначаємо мінімальне число: 1 і (length - 1) нулів (наприклад, 100)
  const min = Math.pow(10, length - 1);
  // Визначаємо максимальне число: (length) дев'яток (наприклад, 999)
  const max = Math.pow(10, length) - 1;

  // Геруємо число в діапазоні [min, max]
  const code = Math.floor(min + Math.random() * (max - min + 1));

  return code;
};

export const parsedExercises_AddSlug = (exercises) => {
  try {
    // 1. Перевіряємо, чи треба парсити, чи це вже об'єкт
    const data =
      typeof exercises === "string" ? JSON.parse(exercises) : exercises;

    if (!Array.isArray(data)) return [];

    // 2. Трансформуємо масив
    return data.map((ex, index) => {
      // Створюємо копію вправи
      const updatedEx = { ...ex, slug: String(index) };

      // Логіка для пар (matching)
      if (updatedEx.type === "pair" && updatedEx.pairs) {
        updatedEx.pairs.left =
          updatedEx.pairs.left?.map((l, i) => ({
            ...l,
            slug: String(i),
          })) || [];

        updatedEx.pairs.right =
          updatedEx.pairs.right?.map((r, i) => ({
            ...r,
            slug: String(i),
          })) || [];
      }

      // Логіка для вводу тексту (trim)
      if (
        updatedEx.type === "enter" &&
        Array.isArray(updatedEx.correctAnswers)
      ) {
        updatedEx.correctAnswers = updatedEx.correctAnswers.map((str) =>
          str.trim(),
        );
      }

      return updatedEx;
    });
  } catch (err) {
    console.error("parsedExercises_AddSlug error:", err);
    throw new Error("Некоректний формат вправ");
  }
};

export const ApplyFilesToExercises = (files, exercises) => {
  if (!files?.length) return;

  files.forEach((file) => {
    // 1. Перевірка на зображення відповіді
    const answerMatch = file.fieldname.match(/q(\d+)\]\[a(\d+)/);
    if (answerMatch) {
      const [_, q, a] = answerMatch.map(Number);
      const answer = exercises[q]?.answers?.[a];
      if (answer) {
        answer.isImage = true;
        answer.imageUrl = file.url;
      }
      return;
    }

    // 2. Перевірка на праве зображення пари
    const pairRightMatch = file.fieldname.match(/pairImages\[q(\d+)\]\[r(\d+)/);
    if (pairRightMatch) {
      const [_, q, r] = pairRightMatch.map(Number);
      const right = exercises[q]?.pairs?.right?.[r];
      if (right) right.imageUrl = file.url;
      return;
    }

    // 3. Перевірка на ліве зображення пари
    const pairLeftMatch = file.fieldname.match(/pairImages\[q(\d+)\]\[l(\d+)/);
    if (pairLeftMatch) {
      const [_, q, l] = pairLeftMatch.map(Number);
      const left = exercises[q]?.pairs?.left?.[l];
      if (left) left.imageUrl = file.url;
    }
  });
};

export const ShuffleArray = (array) => {
  if (!Array.isArray(array)) return [];

  const copy = array.map((item) => ({ ...item }));

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

export const CheckAnswers = (exercises, userAnswers, exBal) => {
  let score = 0;

  exercises.forEach((ex) => {
    const userAnsw = userAnswers.find((a) => a.slug === ex.slug);
    if (!userAnsw) return;

    switch (ex.type) {
      case "one": {
        if (ex.answers[userAnsw.value]?.correct) {
          score += exBal;
        }
        break;
      }

      case "many": {
        const correctIndexes = ex.answers
          .map((a, i) => (a.correct ? i : null))
          .filter((i) => i !== null);

        if (correctIndexes.length > 0) {
          const part = exBal / correctIndexes.length;
          userAnsw.value.forEach((i) => {
            if (correctIndexes.includes(i)) {
              score += part;
            }
          });
        }
        break;
      }

      case "enter": {
        const normalizedAnswer = String(userAnsw.value).trim();
        if (ex.correctAnswers.includes(normalizedAnswer)) {
          score += exBal;
        }
        break;
      }

      case "pair": {
        let correctCount = 0;
        const totalPairs = ex.pairs.left.length;

        userAnsw.value.forEach(([lSlug, rSlug]) => {
          const leftIndex = ex.pairs.left.findIndex((l) => l.slug === lSlug);
          const rightIndex = ex.pairs.right.findIndex((r) => r.slug === rSlug);

          // Перевірка через Map
          if (ex.pairs.correctMap.get(String(leftIndex)) === rightIndex) {
            correctCount++;
          }
        });

        if (totalPairs > 0) {
          score += (exBal / totalPairs) * correctCount;
        }
        break;
      }

      default:
        console.warn(`Unknown exercise type: ${ex.type}`);
    }
  });

  return score;
};

export const GetTestResults = (test, userAnswers) => {
  return test.exercises.map((ex) => {
    const userAnsw = userAnswers.find((a) => a.slug === ex.slug);
    const userValue = userAnsw ? userAnsw.value : null;
    let isCorrect = false;

    switch (ex.type) {
      case "one": {
        isCorrect = !!ex.answers[userValue]?.correct;
        break;
      }

      case "many": {
        const correctIndexes = ex.answers
          .map((a, i) => (a.correct ? i : null))
          .filter((i) => i !== null);

        isCorrect = !!(
          userValue &&
          correctIndexes.length === userValue.length &&
          correctIndexes.every((idx) => userValue.includes(idx))
        );
        break;
      }

      case "enter": {
        isCorrect = !!(
          userValue &&
          ex.correctAnswers.some(
            (ans) =>
              ans.trim().toLowerCase() ===
              String(userValue).trim().toLowerCase(),
          )
        );
        break;
      }

      case "pair": {
        if (userValue && Array.isArray(userValue)) {
          let correctCount = 0;
          const totalPairs = ex.pairs.left.length;

          userValue.forEach(([lSlug, rSlug]) => {
            const leftIndex = ex.pairs.left.findIndex((l) => l.slug === lSlug);
            const rightIndex = ex.pairs.right.findIndex(
              (r) => r.slug === rSlug,
            );

            // Використовуємо квадратні дужки, якщо correctMap — це звичайний об'єкт
            if (ex.pairs.correctMap[String(leftIndex)] === rightIndex) {
              correctCount++;
            }
          });

          isCorrect = correctCount === totalPairs;
        }
        break;
      }

      default:
        isCorrect = false;
    }

    return {
      question: ex.question,
      type: ex.type,
      answers: {
        answer: ex.answers,
        correctAnswers: ex.correctAnswers,
        pairs: ex.pairs,
      },
      userAnswer: userValue,
      isCorrect,
    };
  });
};

//========== Мультер та хешування для фото =============
export const uploadImg = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Тільки зображення"));
    }
    cb(null, true);
  },
});

// Middleware для хешування та збереження файлів
export const hashFiles = (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files.length) return next();

  files.forEach((file) => {
    const ext = path.extname(file.originalname);
    const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");
    const filename = `${hash}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // якщо вже є — не записуємо
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.buffer);
    }

    // додаємо url
    file.url = `/uploads/${filename}`;
  });

  next();
};
