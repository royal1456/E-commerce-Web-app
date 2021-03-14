const Category = require("../models/category");
const { check } = require("express-validator");
checkCategoryReplicate = (category, unwantedParent) => {
  let ans = category.parent.find((i) => i == `${unwantedParent}`);
  return ans ? 1 : 0;
};
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "NO categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  // if(!req.category){}
  const category = req.category;
  if (req.body.parent) {
    //remove duplicates
    req.body.parent = [...new Set(req.body.parent)];
    if (checkCategoryReplicate(req.body, req.category._id))
      return res.status(400).json({
        error: "Wrong Category passed in parent",
      });
    category.parent = req.body.parent;
  }
  category.name = req.body.name;
  
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
      
    }
    console.log(updatedCategory.populated());
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    res.json({
      message: "Successfull deleted",
    });
  });
};
