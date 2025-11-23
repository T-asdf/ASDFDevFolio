import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 안쓰려고?'],
    maxlength: [60, '제목이 뭐이리 길어'],
  },

  content: {
    type: String,
    required: [true, '내용 입력을 안했다고?'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);