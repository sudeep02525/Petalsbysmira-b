import AccessRequest from "../models/AccessRequest.js";
import Product from "../models/Product.js";

// @route POST /api/requests
// @desc Create a new access request (Public)
export const createRequest = async (req, res) => {
  try {
    const { fullName, email, phone, preferredContactMethod, productId, collectionId, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !productId) {
      return res.status(400).json({ message: "Full Name, Email, Phone, and Product are required." });
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found or unavailable." });
    }

    if (!product.requestAccessEnabled) {
      return res.status(400).json({ message: "Access requests are currently disabled for this product." });
    }

    // Duplicate check: Same email + same product within the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingRequest = await AccessRequest.findOne({
      email: email.toLowerCase(),
      productId,
      createdAt: { $gte: oneDayAgo },
    });

    if (existingRequest) {
      return res.status(429).json({
        message: "You have already submitted a request for this item recently. Our team will contact you shortly.",
      });
    }

    // Create the request
    const newRequest = await AccessRequest.create({
      fullName,
      email,
      phone,
      preferredContactMethod: preferredContactMethod || "Phone",
      productId,
      collectionId: collectionId || product.collectionId || product.category,
      message,
    });

    res.status(201).json({
      message: "Request received successfully.",
      requestId: newRequest._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests
// @desc Get all access requests (Admin)
export const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, productId, collectionId } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    if (collectionId) filter.collectionId = collectionId;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      AccessRequest.find(filter)
        .populate("productId", "name images")
        .populate("collectionId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AccessRequest.countDocuments(filter),
    ]);

    res.json({
      requests,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests/:id
// @desc Get request details (Admin)
export const getRequestById = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.id)
      .populate("productId", "name images slug")
      .populate("collectionId", "name");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/requests/:id
// @desc Update request status/notes (Admin)
export const updateRequest = async (req, res) => {
  try {
    const { status, internalNotes } = req.body;

    const request = await AccessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (status) request.status = status;
    if (internalNotes !== undefined) request.internalNotes = internalNotes;

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
