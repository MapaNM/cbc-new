import express from 'express';
import { createProduct, deleteProducts, getProducts, getProductsInfo, updateProduct,} from '../controllers/productController.js';

const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/:productId", getProductsInfo)
productRouter.delete("/:productId", deleteProducts)
productRouter.put("/:productId", updateProduct)

export default productRouter;