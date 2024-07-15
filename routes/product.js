import { Router } from "express";
import {
  getAllProducts,
  getProductForm,
  createProducts,
  getEditProductForm,
  editProduct,deleteProducts
} from "../controllers/product.js";
import { Authenticate } from "../middleware/Verifytoken.js";
import multer from "multer";

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", Authenticate, getAllProducts);
router.get("/create-product", Authenticate, getProductForm);
router.post(
  "/create-product",
  upload.single("productImage"),
  Authenticate,
  createProducts
);
router.get("/:id/edit", Authenticate, getEditProductForm);
router.put("/:id/edit",upload.single('productImage'), Authenticate, editProduct);
router.delete("/:id", Authenticate, deleteProducts);

export default router;
