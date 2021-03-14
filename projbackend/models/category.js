const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },//The type of the parent reference must match the type of the _id in the model it references. So instead of Schema.Types.ObjectId it should be String
    parent:  [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
      }
    ]
  },
  { timestamps: true }
);
categorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'parent',
    select: '-__v -createdAt -updatedAt -parent'
  });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
