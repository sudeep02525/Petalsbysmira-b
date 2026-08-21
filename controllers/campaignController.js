import Campaign from "../models/Campaign.js";
import cloudinary from "../config/cloudinary.js";

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

// @route GET /api/campaigns/active
// @desc Get active campaigns for the frontend
export const getActiveCampaigns = async (req, res) => {
  try {
    const now = new Date();
    
    const campaigns = await Campaign.find({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
      "images.0": { $exists: true } // Must have at least one image
    }).sort({ priority: -1, displayOrder: 1, createdAt: -1 });

    // Filter out disabled images from the active campaigns
    const validCampaigns = campaigns.map(campaign => {
      const campaignObj = campaign.toObject();
      campaignObj.images = campaignObj.images.filter(img => img.enabled);
      return campaignObj;
    }).filter(campaign => campaign.images.length > 0);

    res.json({
      success: true,
      campaigns: validCampaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/campaigns
// @desc Get all campaigns for admin panel
export const getAdminCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      campaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/admin/campaigns/:id
// @desc Get single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/admin/campaigns
// @desc Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    let campaignData = req.body;
    
    // If sent as FormData with a JSON string field 'data'
    if (req.body.data) {
      campaignData = JSON.parse(req.body.data);
    }

    const {
      title,
      subtitle,
      description,
      cta,
      startDate,
      endDate,
      status,
      priority,
      displayOrder,
      imageConfigs // Array of objects with image metadata (alt, link, title, enabled) corresponding to uploaded files
    } = campaignData;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Title, start date, and end date are required" });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        // Find corresponding config if provided, otherwise use defaults
        const config = (imageConfigs && imageConfigs[index]) ? imageConfigs[index] : {};
        images.push({
          url: file.path,
          publicId: getCloudinaryPublicId(file.path),
          alt: config.alt || "",
          title: config.title || "",
          link: config.link || "",
          displayOrder: config.displayOrder || index,
          enabled: config.enabled !== undefined ? config.enabled : true
        });
      });
    }

    const campaign = await Campaign.create({
      title,
      subtitle,
      description,
      cta,
      startDate,
      endDate,
      status,
      priority,
      displayOrder,
      images
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/admin/campaigns/:id
// @desc Update an existing campaign
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    let campaignData = req.body;
    if (req.body.data) {
      campaignData = JSON.parse(req.body.data);
    }

    const {
      title,
      subtitle,
      description,
      cta,
      startDate,
      endDate,
      status,
      priority,
      displayOrder,
      existingImages, // Array of existing image objects to keep
      newImageConfigs // Array of configs for the NEWLY uploaded files
    } = campaignData;

    // Update simple fields
    if (title) campaign.title = title;
    if (subtitle !== undefined) campaign.subtitle = subtitle;
    if (description !== undefined) campaign.description = description;
    if (cta) campaign.cta = cta;
    if (startDate) campaign.startDate = startDate;
    if (endDate) campaign.endDate = endDate;
    if (status) campaign.status = status;
    if (priority !== undefined) campaign.priority = priority;
    if (displayOrder !== undefined) campaign.displayOrder = displayOrder;

    // Handle Images
    let finalImages = [];
    const existingImagesToKeep = existingImages || [];
    
    // Find deleted images and remove from Cloudinary
    const existingUrlsToKeep = existingImagesToKeep.map(img => img.url);
    const deletedImages = campaign.images.filter(img => !existingUrlsToKeep.includes(img.url));
    
    for (const img of deletedImages) {
      const publicId = img.publicId || getCloudinaryPublicId(img.url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(console.error);
      }
    }

    // Add back the kept existing images (with potentially updated metadata)
    finalImages = [...existingImagesToKeep];

    // Append new uploaded images
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const config = (newImageConfigs && newImageConfigs[index]) ? newImageConfigs[index] : {};
        finalImages.push({
          url: file.path,
          publicId: getCloudinaryPublicId(file.path),
          alt: config.alt || "",
          title: config.title || "",
          link: config.link || "",
          displayOrder: config.displayOrder || (finalImages.length + index),
          enabled: config.enabled !== undefined ? config.enabled : true
        });
      });
    }

    // Sort images by displayOrder
    finalImages.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    campaign.images = finalImages;

    await campaign.save();

    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/admin/campaigns/:id
// @desc Delete a campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // Delete images from Cloudinary
    if (campaign.images && campaign.images.length > 0) {
      for (const img of campaign.images) {
        const publicId = img.publicId || getCloudinaryPublicId(img.url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(console.error);
        }
      }
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
