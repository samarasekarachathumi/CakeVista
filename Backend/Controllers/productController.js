import Product from "../Models/Product.js";

export async function getProducts(req, res) {
 
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export function saveProducts(req, res) {
  if (req.user == null) {
    res.status(403).json({ message: "Unauthorized" });
    return; // ✅ return is correct here, inside the function
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Unauthorized, you need to be an admin" });
    return;
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.body.imageUrl
  });

  product
    .save()
    .then(() => {
      res.json({
        message: "Product created successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to create product",
      });
    });
}
