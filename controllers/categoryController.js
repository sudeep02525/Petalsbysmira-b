import Category from "../models/Category.js";

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const image = req.file ? req.file.path : req.body.image || "";

    const category = await Category.create({
      name,
      slug: slugify(name),
      description,
      image,
      displayOrder: displayOrder || 0,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    ["name", "description", "displayOrder", "isActive"].forEach((field) => {
      if (req.body[field] !== undefined) category[field] = req.body[field];
    });
    if (req.file) category.image = req.file.path;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCategories, createCategory, updateCategory, deleteCategory };
