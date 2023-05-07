import mongoose from "mongoose";

const PageDataSchema = new mongoose.Schema({
  path: {
    type: String,
  },
  query: {
    type: String,
  },
  hash: {
    type: String,
  },
  fullpath: {
    type: String,
  },
  title: {
    type: String,
  },
});

export default PageDataSchema;
