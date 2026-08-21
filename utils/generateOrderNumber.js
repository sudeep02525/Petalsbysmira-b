import Order from "../models/Order.js";

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  const next = (count + 1).toString().padStart(6, "0");
  return `PBS-${next}`;
};

export default generateOrderNumber;
