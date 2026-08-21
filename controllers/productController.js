import Product from "../models/Product.js";
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";

// helper: turn "Green Butterfly Bracelet" -> "green-butterfly-bracelet-<random>"
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-") +
  "-" +
  Math.random().toString(36).substring(2, 7);

// helper: extract public_id from cloudinary URL
const getCloudinaryPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  const publicIdWithExt = lastPart.split(".")[0];
  const folder = parts[parts.length - 2];
  if (folder && folder !== "upload") {
    return `${folder}/${publicIdWithExt}`;
  }
  return publicIdWithExt;
};

// @route GET /api/products
// query params: category, occasion, minPrice, maxPrice, search, sort, page, limit, featured, newArrival
const getProducts = async (req, res) => {
  try {
    const {
      category,
      occasion,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 20,
      featured,
      newArrival,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (occasion) filter.occasionTags = occasion;
    if (featured === "true") filter.isFeatured = true;
    if (newArrival === "true") filter.isNewArrival = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { numReviews: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).populate("category", "name slug").sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/:idOrSlug
const getProductById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
    const product = await Product.findOne(query).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/products
const getAdminProducts = async (req, res) => {
  try {
    const { search, category, isActive, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined && isActive !== "") {
      filter.isActive = isActive === "true";
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).populate("category", "name").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      subCategory,
      stock,
      sku,
      occasionTags,
      isFeatured,
      isNewArrival,
      isActive,
    } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let images = [];
    if (req.files?.length) {
      images = req.files.map((f) => f.path);
    }

    const product = await Product.create({
      name,
      slug: slug || slugify(name),
      description,
      shortDescription,
      price,
      discountPrice: discountPrice || null,
      category,
      subCategory,
      sku: sku || undefined,
      images,
      stock,
      occasionTags: occasionTags
        ? Array.isArray(occasionTags)
          ? occasionTags
          : occasionTags.split(",").map((t) => t.trim())
        : [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      isActive: isActive !== undefined ? (isActive === "true" || isActive === true) : true,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate SKU or Slug" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatable = [
      "name",
      "slug",
      "description",
      "shortDescription",
      "price",
      "discountPrice",
      "category",
      "subCategory",
      "stock",
      "isFeatured",
      "isNewArrival",
      "isActive",
    ];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (req.body[field] === "true") product[field] = true;
        else if (req.body[field] === "false") product[field] = false;
        else product[field] = req.body[field];
      }
    });

    if (req.body.sku !== undefined) {
      product.sku = req.body.sku === "" ? undefined : req.body.sku;
    }

    if (req.body.occasionTags !== undefined) {
      product.occasionTags = Array.isArray(req.body.occasionTags)
        ? req.body.occasionTags
        : req.body.occasionTags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Handle existing images to keep
    let existingImages = req.body.existingImages || [];
    if (!Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }
    
    // Find deleted images and remove from Cloudinary
    const deletedImages = product.images.filter(img => !existingImages.includes(img));
    for (const imgUrl of deletedImages) {
      const publicId = getCloudinaryPublicId(imgUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(console.error);
      }
    }

    let finalImages = [...existingImages];
    // add new uploaded images to existing ones
    if (req.files?.length) {
      finalImages = [...finalImages, ...req.files.map((f) => f.path)];
    }
    
    product.images = finalImages;

    await product.save();
    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate SKU or Slug" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 1. Check if product exists in any orders
    const existingOrder = await Order.findOne({ "items.product": product._id });
    if (existingOrder) {
      return res.status(400).json({ 
        message: "This product has existing orders and cannot be permanently deleted. Please deactivate it instead.",
        hasOrders: true 
      });
    }

    // 2. If no orders exist, permanently delete Cloudinary images
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        const publicId = getCloudinaryPublicId(imgUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(console.error);
        }
      }
    }

    // 3. Delete product document
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getProducts, getProductById, getAdminProducts, createProduct, updateProduct, deleteProduct };
