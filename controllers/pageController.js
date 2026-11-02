import Page from "../models/Page.js";

const DEFAULT_PAGES = {
  "our-story": { title: "Our Story", subtitle: "The heritage behind the house" },
  experience: { title: "The Experience", subtitle: "Luxury, curated differently" },
  contact: { title: "Concierge & Care", subtitle: "We are here for you" },
  privacy: { title: "Privacy Policy", subtitle: "" },
  terms: { title: "Terms of Service", subtitle: "" },
  "request-access": { title: "Request Private Access", subtitle: "" },
};

// PUBLIC
export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (page) {
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      return res.json(page);
    }

    // fallback so the site never breaks
    const fallback = DEFAULT_PAGES[req.params.slug];
    if (!fallback) return res.status(404).json({ message: "Page not found" });

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({
      slug: req.params.slug,
      ...fallback,
      sections: [],
      seo: {},
      isPublished: true,
      isFallback: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN
export const listPages = async (req, res) => {
  try {
    const pages = await Page.find().select("slug title isPublished updatedAt").sort({ slug: 1 });
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let page = await Page.findOne({ slug });
    if (!page) {
      const fallback = DEFAULT_PAGES[slug] || { title: slug.replace(/-/g, " ") };
      page = {
        slug,
        title: fallback.title || "",
        subtitle: fallback.subtitle || "",
        heroImageUrl: "",
        sections: [],
        seo: { title: fallback.title || "", description: "" },
        isPublished: true,
      };
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, heroImageUrl, sections, seo, isPublished } = req.body;

    const page = await Page.findOneAndUpdate(
      { slug },
      { slug, title, subtitle, heroImageUrl, sections, seo, isPublished },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      fetch(`${process.env.FRONTEND_URL}/api/revalidate?path=/${slug}&secret=${process.env.REVALIDATE_SECRET}`).catch(() => {});
    }

    res.json({ message: "Page saved", page });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
