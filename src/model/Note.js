import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    isComplete: {
      type: Boolean,
      required: [true, "Please specify if the note is complete"],
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", NoteSchema);
export default Note;
