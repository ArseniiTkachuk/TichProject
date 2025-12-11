import ParModel from '../models/Par.js';

// Функція для перемішування масиву (Fisher-Yates shuffle)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const getPars = async (req, res) => {
  try {
    // Отримуємо всі пари з БД
    const allPars = await ParModel.find();

    if (allPars.length < 15) {
      return res.status(500).json({ message: 'Недостатньо пар у базі. Має бути мінімум 15.' });
    }

    // Випадковий вибір 10 функцій з усіх 15 (без повторів)
    const shuffledPars = shuffleArray(allPars);
    const selectedFunctions = shuffleArray(shuffledPars.slice(0, 10));

    // Всі 15 графіків перемішані
    const shuffledGraphs = shuffleArray(allPars);

    // Відповідь у вигляді об'єкта з двома масивами
    res.json({
      functions: selectedFunctions.map(({ func, slug, label }) => ({ func, slug, label })),
      graphs: shuffledGraphs.map(({ imageUrl, slug }) => ({ imageUrl, slug })),
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const checkPars = async (req, res) => {
  try {
    let score = 0;
    const details = []

    req.body.pairs.forEach(pair => {
      if (pair.funcSlug == pair.graphSlug) {
        score += 10;
        details.push({
          correct: true,
          funcSlug: pair.funcSlug,
          graphSlug: pair.graphSlug,
        })
      } else {
        details.push({
          correct: false,
          funcSlug: pair.funcSlug,
          graphSlug: pair.graphSlug,
        })
      }
    });

    res.json({
      score: score,
      details: details,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
