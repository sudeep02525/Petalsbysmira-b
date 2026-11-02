import Faq from "../models/Faq.js";

// PUBLIC — grouped by category
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isPublished: true }).sort({ category: 1, order: 1 });

    const grouped = faqs.reduce((acc, f) => {
      const found = acc.find((g) => g.category === f.category);
      if (found) {
        found.questions.push({ _id: f._id, q: f.question, a: f.answer, order: f.order });
      } else {
        acc.push({
          category: f.category,
          questions: [{ _id: f._id, q: f.question, a: f.answer, order: f.order }],
        });
      }
      return acc;
    }, []);

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ categories: grouped, total: faqs.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN
export const listFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ category: 1, order: 1 });
    res.json({ faqs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { category, question, answer, order, isPublished } = req.body;
    if (!category || !question || !answer) {
      return res.status(400).json({ message: "Category, question and answer are required." });
    }
    const faq = await Faq.create({
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      order: Number(order) || 0,
      isPublished: isPublished !== false,
    });
    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      fetch(`${process.env.FRONTEND_URL}/api/revalidate?path=/faq&secret=${process.env.REVALIDATE_SECRET}`).catch(() => {});
    }
    res.status(201).json({ message: "FAQ created", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      fetch(`${process.env.FRONTEND_URL}/api/revalidate?path=/faq&secret=${process.env.REVALIDATE_SECRET}`).catch(() => {});
    }
    res.json({ message: "FAQ updated", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    if (process.env.FRONTEND_URL && process.env.REVALIDATE_SECRET) {
      fetch(`${process.env.FRONTEND_URL}/api/revalidate?path=/faq&secret=${process.env.REVALIDATE_SECRET}`).catch(() => {});
    }
    res.json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
