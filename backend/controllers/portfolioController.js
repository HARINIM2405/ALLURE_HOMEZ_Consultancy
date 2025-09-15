import Portfolio from '../models/Portfolio.js';

// GET portfolio data
export const getPortfolio = async (req, res) => {
  try {
    const data = await Portfolio.findOne(); // Only one document expected
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio data', error });
  }
};

// POST or PUT (upsert) portfolio data
export const upsertPortfolio = async (req, res) => {
  try {
    const {
      introTitle,
      introText,
      materialTitle,
      materialDescription,
      materials,
      dealersTitle,
      dealersText,
      dealers,
      featuredProjects, // <-- Corrected field
      productShowcase
    } = req.body;

    const updated = await Portfolio.findOneAndUpdate(
      {},
      {
        introTitle,
        introText,
        materialTitle,
        materialDescription,
        materials,
        dealersTitle,
        dealersText,
        dealers,
        featuredProjects, // <-- Corrected field
        productShowcase
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save portfolio data', error });
  }
};
