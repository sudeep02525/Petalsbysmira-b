import crypto from "crypto";
import AccessRequest from "../models/AccessRequest.js";
import Product from "../models/Product.js";
import { sendPrivateAccessEmail } from "../utils/emailService.js";

// @route POST /api/requests
// @desc Create a new access request (Public)
export const createRequest = async (req, res) => {
  try {
    const { fullName, email, phone, preferredContactMethod, productId, collectionId, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: "Full Name, Email and Phone are required." });
    }

    let product = null;
    if (productId) {
      product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Product not found or unavailable." });
      }

      if (!product.requestAccessEnabled) {
        return res.status(400).json({ message: "Access requests are currently disabled for this product." });
      }
    }

    // Duplicate check: Same email + same product (or general request) within the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingQuery = {
      email: email.toLowerCase(),
      createdAt: { $gte: oneDayAgo },
    };
    if (productId) {
      existingQuery.productId = productId;
    }
    const existingRequest = await AccessRequest.findOne(existingQuery);

    if (existingRequest) {
      return res.status(429).json({
        message: "You have already submitted a request recently. Our team will contact you shortly.",
      });
    }

    const newRequest = await AccessRequest.create({
      fullName,
      email,
      phone,
      preferredContactMethod: preferredContactMethod || "Phone",
      ...(productId && { productId }),
      collectionId: collectionId || product?.collectionId || product?.category,
      message,
    });

    // Emit event to admin clients
    const io = req.app.get("io");
    if (io) {
      io.emit("newAccessRequest", { requestId: newRequest._id });
    }

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
        .populate("productId", "name images slug price stock shortSubtitle")
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
      .populate("productId", "name images slug price stock shortSubtitle")
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

    const ALLOWED = ["New", "Contacted", "In Discussion", "Access Granted", "Closed", "Rejected"];
    if (status && !ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    if (status) request.status = status;
    if (internalNotes !== undefined) request.internalNotes = internalNotes;

    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generatePrivateAccess = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.privateAccessToken) {
      return res.status(400).json({ message: "Access link already generated" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    request.privateAccessToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    request.privateAccessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    request.privateAccessRevoked = false;
    request.status = "Access Granted";
    
    await request.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const accessUrl = `${frontendUrl}/private-access/${rawToken}`;
    
    let emailSent = true;
    let emailError = null;
    try {
      await sendPrivateAccessEmail(request.email, request.fullName, accessUrl);
    } catch (e) {
      emailSent = false;
      emailError = e.message;
      console.error("Private access email failed:", e.message);
    }

    res.json({
      message: emailSent
        ? "Access link generated and email sent successfully."
        : `Link generated, but email could not be delivered: ${emailError || "Delivery failed"}. Please copy the link below and share it manually.`,
      accessUrl,
      emailSent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendPrivateAccess = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.id);
    if (!request || !request.privateAccessToken) {
      return res.status(404).json({ message: "Valid request not found" });
    }
    
    // Generate a new token and refresh the expiry time (24h)
    const rawToken = crypto.randomBytes(32).toString("hex");
    request.privateAccessToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    request.privateAccessRevoked = false;
    request.privateAccessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    request.status = "Access Granted";
    
    await request.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const accessUrl = `${frontendUrl}/private-access/${rawToken}`;
    
    let emailSent = true;
    let emailError = null;
    try {
      await sendPrivateAccessEmail(request.email, request.fullName, accessUrl);
    } catch (e) {
      emailSent = false;
      emailError = e.message;
      console.error("Private access email failed:", e.message);
    }

    res.json({
      message: emailSent
        ? "Access link email resent successfully."
        : `Link refreshed, but email could not be delivered: ${emailError || "Delivery failed"}. Please copy the link below and share it manually.`,
      accessUrl,
      emailSent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const revokePrivateAccess = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    request.privateAccessRevoked = true;
    await request.save();

    res.json({ message: "Access revoked successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "No token provided" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const request = await AccessRequest.findOne({ privateAccessToken: hashedToken });

    if (!request) return res.status(404).json({ message: "Invalid or expired link." });
    if (request.privateAccessRevoked) return res.status(401).json({ message: "Access has been revoked." });
    if (request.privateAccessExpiresAt && new Date() > request.privateAccessExpiresAt) {
      return res.status(401).json({ message: "Link has expired." });
    }

    // Mark first usage timestamp if not already marked
    if (!request.privateAccessUsedAt) {
      request.privateAccessUsedAt = new Date();
      await request.save();
    }

    let productSlug = null;
    if (request.productId) {
      const product = await Product.findById(request.productId).select("slug");
      productSlug = product?.slug || null;
    }

    // Set HTTP-only cookie
    res.cookie("privateAccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      valid: true,
      message: "Access granted",
      privateAccessToken: token,
      productSlug,
      expiresAt: request.privateAccessExpiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
