import Test from '../models/test.js';
import mongoose from 'mongoose';

export const createTest = async (req, res) => {
  try {
    const { title, exercises } = req.body;

    const test = new Test({
      title,
      author: new mongoose.Types.ObjectId(req.userId), // <-- тут обов'язково new
      exercises: JSON.parse(exercises)
    });

    await test.save();
    res.json(test);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при створенні тесту', error: err });
  }
};
