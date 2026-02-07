import Content from "../models/Content.model.js";

// GET CONTENT (PUBLIC or ADMIN)
export const getContent = async (req, res) => {
  try {
    const { type } = req.query;
    // If authenticated as admin, show draft/published. If public (future), show only published.
    // For now, this is admin side, so show logic handles existence.
    
    // We assume the user is logged in as Panchayat Admin for this endpoint
    const panchayatId = req.user.panchayatId;

    const content = await Content.findOne({ panchayat: panchayatId, type });
    
    if (!content) {
      // Return empty structure if not found so frontend can initialize
      return res.json({ type, title: "", body: "", status: "draft", media: [] });
    }

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch content" });
  }
};

// UPSERT CONTENT (SAVE DRAFT OR PUBLISH)
export const saveContent = async (req, res) => {
  try {
    const { type, title, body, status, media } = req.body;
    const panchayatId = req.user.panchayatId;

    let content = await Content.findOne({ panchayat: panchayatId, type });

    if (content) {
      content.title = title || content.title;
      content.body = body || content.body;
      content.status = status || content.status;
      if (media) content.media = media; // Replace media for now
      content.lastEditedBy = req.user._id;
      await content.save();
    } else {
      content = await Content.create({
        panchayat: panchayatId,
        type,
        title,
        body,
        status,
        media,
        lastEditedBy: req.user._id,
      });
    }

    res.json(content);
  } catch (err) {
    res.status(500).json({ message: "Failed to save content" });
  }
};

// UPLOAD MEDIA (Handling single file for now)
export const uploadContentMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const normalizePath = (p) => p?.replace(/\\/g, "/");
    const url = normalizePath(req.file.path);

    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};
