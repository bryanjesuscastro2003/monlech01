import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      maxLength: 60,
    },
    questions: [
      {
        question: { type: String, required: true },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserMonn",
          required: true,
        },
        responses: [
          {
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "UserMonn",
              required: true,
            },
            response: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SubjectMonn ||
  mongoose.model("SubjectMonn", SubjectSchema);
