import mongoose from 'mongoose';

const ParSchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true 
  },
  func: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  label: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Par', ParSchema);
