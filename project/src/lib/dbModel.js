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

  slug: {
    type: String,
    unique: true,
  },
});

NoteSchema.pre('save', async function () { 
    const doc = this;

    if (!doc.isModified('title') && doc.slug) {
        return; 
    }
    
    let baseSlug = doc.title
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    if (!baseSlug || baseSlug.trim() === '') {
        baseSlug = "untitled"; 
    }

    doc.slug = baseSlug;

    const NoteModel = mongoose.models.Note || mongoose.model('Note', NoteSchema);

    let counter = 1;
    let uniqueSlug = doc.slug;
    let existingNote = null;
    
    do {
        existingNote = await NoteModel.findOne({ slug: uniqueSlug });

        if (existingNote && existingNote._id.toString() !== doc._id?.toString()) {
            uniqueSlug = `${baseSlug}-${counter++}`;
        } 
        
        else {
            existingNote = null; 
        }
    } while (existingNote);

    doc.slug = uniqueSlug;
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);