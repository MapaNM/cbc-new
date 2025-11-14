import express from 'express';
import { createProduct, deleteProducts, getProducts, getProductsInfo, searchProducts, updateProduct,} from '../controllers/productController.js';

const productRouter = express.Router();
productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/:productId", getProductsInfo)
productRouter.delete("/:productId", deleteProducts)
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:query", searchProducts)

export default productRouter;