import crypto from "crypto";
import AccessRequest from "../models/AccessRequest.js";

export const checkPrivateAccess = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.privateAccessToken;

    if (!rawToken) {
      req.hasPrivateAccess = false;
      return next();
    }

    // Hash the raw token to match what's in the DB
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const accessRequest = await AccessRequest.findOne({ privateAccessToken: hashedToken });

    if (!accessRequest) {
      req.hasPrivateAccess = false;
      return next();
    }

    // Check if revoked
    if (accessRequest.privateAccessRevoked) {
      req.hasPrivateAccess = false;
      return next();
    }

    // Check if expired
    if (accessRequest.privateAccessExpiresAt && new Date() > accessRequest.privateAccessExpiresAt) {
      req.hasPrivateAccess = false;
      return next();
    }

    req.hasPrivateAccess = true;
    next();
  } catch (error) {
    console.error("Error in checkPrivateAccess middleware:", error);
    req.hasPrivateAccess = false;
    next();
  }
};
