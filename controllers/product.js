import { Product } from "../models/Product.js";

// import { Product } from "../models/Product";

export const getAllProducts = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  try {
    const products = await Product.find({})
    .skip((perPage*page) - perPage)
    .limit(perPage);
    // console.log(products);

    const count = await Product.countDocuments();
    
    res.render("products", { productList: products, current:page, pages:Math.ceil(count/ perPage) });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getProductForm = (req, res) => {
  res.render("product-create");
};

export const createProducts = async (req, res) => {
  try {
    let { productName, description, price } = req.body;
    const name = productName;
    //   console.log(req.body);
    const productImage = req.file ? req.file.path : ""; // Handle productImage only if a file is uploaded

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      image: productImage,
    });

    // Save product to database
    await newProduct.save();
    res.redirect("/products");
    //   console.log(newProduct)

    //   res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getEditProductForm = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.render("editform", { product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // console.log(productId);
    const { productName, description, price } = req.body;
    // console.log(req.body);
    let updateFields = { name: productName, description, price };
    // console.log(updateFields);
    // console.log(req.file);
    // Handle updated file if provided
    if (req.file) {
      updateFields.productImage = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    // await updatedProduct.save();
    res.redirect("/products");
    // res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if(!product){
      return res.status(404).json({ message: "Product not found" });
    }
    // return res.status(200).json({ message: "Product deleted successfully"});
    res.redirect('/products');
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}
