import mongoose ,{ Schema , Model } from "mongoose";

const viewsSchema = new Schema({
  timestamp: { type: Number, required: true },
});
const linkSchema = new Schema({
  id: { type: String, required: true, index: { unique: true, sparse: true } },
  views: { type:[viewsSchema], default: []},
  destination: { type: String, required: true },
  timestamp: { type: Number, required: true },
  title: { type: String }, // Add title field
  description: { type: String }, // Add description field
  image: { type: String }, 
});

const domainSchema = new Schema({
  destination: { type: String, required: true },
  links: { type:[linkSchema], default: []},
  timestamp: { type: Number, required: true },
});

const userSchema = new Schema({
  tag: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  timestamp: { type: Number, required: true },
  domains: { type:[domainSchema], default: []}
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;