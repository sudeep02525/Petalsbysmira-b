import { getShippingRates } from "../services/shiprocketService.js";

// @route POST /api/shipping/rates
// body: { deliveryPincode, weight, length, breadth, height, cod }
export const calculateRates = async (req, res) => {
  try {
    const { deliveryPincode, weight, cod } = req.body;

    if (!deliveryPincode) {
      return res.status(400).json({ message: "deliveryPincode is required" });
    }

    const ratesData = await getShippingRates({
      deliveryPincode,
      weight: weight || 0.5,
      cod: cod === true,
    });

    if (ratesData.status !== 200 || !ratesData.data) {
      return res.status(400).json({ message: "Failed to fetch shipping rates", details: ratesData });
    }

    res.json({
      serviceability: ratesData.data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
