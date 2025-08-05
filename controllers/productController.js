import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){

   if(  isAdmin(req)){
    return res.status(403).json({ message: "Access denied, Admins Only." });
   }

    const product = new Product(req.body)

    try{
        const respond = await product.save();
        res.json({
            message : "Product Created Succesfully",
            product : respond
        })

    }catch(error){
        console.log("Error Creating Product:", error);
        return res.status(500).json({ message: "Failed to create product" })
    }
}

export async function getProducts(req,res){
    try {
        if (! isAdmin(req)) {
            const products = await Product.find();
            return res.json(products);
        }else{
            const products = await Product.find( { isAvailable: true } );
            return res.json(products);
        }
    } catch (error){
        console.error("Error Fetching products:", error);
        return res.status(500).json({ message: "Failed to fetch products" });
    }
}

export async function deleteProducts(req,res){
    if(isAdmin(req)){
        res.status(403).json({ message: "Access denied by deleting, Admins Only." });
        return;
    }

    try {
        
        const productId = req.params.productId;

        await Product.deleteOne({
            productId : productId
        })

        res.json({ message: "Product Deleted Successfully" });

    } catch (error) {
        console.error("Error Deleting Product:", error);
        res.status(500).json({ message: "Failed to delete product" });
        return;

    }
}

export async function updateProduct(req,res){
    if(  isAdmin(req)){
        res.status(403).json({ message: "Access denied by updating, Admins Only."});
        return;
}

const data = req.body;
const productId = req.params.productId;
//To prevent overwriting the productId
//data.productId = productId;

try {
    await Product.updateOne(
        { productId: productId 

        },data
    );
    res.json({ message: "Product Updated Successfully" });
} catch (error) {
    console.log("Error Updating Product:", error);
    res.status(500).json({ message: "Failed to update product" });
    return;
}
}

export async function getProductsInfo(req,res){
  try {
    
    const productId = req.params.productId;
    const product = await Product.findOne({productId: productId});

    if(product == null){
        res.status(404).json({ message: "Product Not Found" });
        return;
    }

    if(isAdmin(req)){
        res.json(product);
    }else{
        if(product.isAvailable){
            res.json(product);

        }else{
            res.status(404).json({ message: "Product Not Available" });
        }
    }

  } catch (error) {
    console.error("Error Fetching Produc Info:", error);
    res.status(404).json({ message: "Failed to Fetch Product" });
    return;
  }
}