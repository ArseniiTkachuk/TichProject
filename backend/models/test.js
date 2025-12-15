import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    exercises: [
        {
            type: {
                type: String,
                enum: ['pair', 'one', 'many', 'enter'],
                required: true
            },

            question: String,

            hasImage: {
                type: Boolean,
                default: false
            },

            answers: [
                {
                    text: String,
                    correct: Boolean
                }
            ],

            // тільки для pair
            pairs: [
                {
                    first: String,
                    second: String
                }
            ],

            wrongFirstRes: [String],
            wrongSecondRes: [String]
        }

    ]

}, { timestamps: true })

export default mongoose.model('Test', TestSchema);