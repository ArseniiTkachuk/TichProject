import mongoose from "mongoose";

/* ===== PAIR ===== */
const PairSchema = new mongoose.Schema({
  left: {
    type: [String],
    required: true
  },
  right: {
    type: [String],
    required: true
  },
  correctMap: {
    type: Map,
    of: Number, // leftIndex -> rightIndex
    required: true
  }
}, { _id: false });

/* ===== ANSWER ===== */
const AnswerSchema = new mongoose.Schema({
  text: String,
  correct: Boolean,
  isImage: {
    type: Boolean,
    default: false
  },
  imageUrl: String
}, { _id: false });

/* ===== EXERCISE ===== */
const ExerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pair', 'one', 'many', 'enter'],
    required: true
  },

  question: {
    type: String,
    required: true
  },

  answers: {
    type: [AnswerSchema],
    default: []
  },

  correctAnswers: {
    type: [String],
    default: []
  },

  pairs: {
    type: PairSchema,
    default: null
  }

}, { _id: false });

/* ===== TEST ===== */
const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  exercises: {
    type: [ExerciseSchema],
    required: true
  }

}, { timestamps: true });

export default mongoose.model('Test', TestSchema);
