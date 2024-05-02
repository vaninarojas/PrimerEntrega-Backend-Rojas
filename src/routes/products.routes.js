import  { Router } from "express";
import ProductManager from "../app.js";
import { uploadMiddleware } from "../uploader.js";

const router = Router()
const manager = new ProductManager("./src/products.json");


router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const products = await manager.getProducts(limit);
        res.send({ status: 1, payload: products });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al obtener los productos" });
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await manager.getProductById(req.params.pid);
        res.send({ status: 1, payload: product });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al obtener el producto" });
    }
});



router.post("/", uploadMiddleware, async (req, res) => {
    try {
        const { title, price, description, thumbnails } = req.body;

        if (!title || !price || !description) {
            return res.status(400).send({ status: 0, message: "Los campos 'name', 'price' y 'description' son obligatorios." });
        }

        const id = generateUniqueId();
        
        const newProduct = {
            id: id,
            title: title,
            price: price,
            description: description,
            thumbnails: thumbnails || [], 
        };

        await manager.addProduct(newProduct);

        res.status(201).send({ status: 1, message: "Producto agregado correctamente", payload: newProduct });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al agregar el producto" });
    }
});


router.put("/:pid", async (req, res) => {
    try {
        const { title, price, description, thumbnails } = req.body;
        const productId = req.params.pid;

       
        if (!title || !price || !description) {
            return res.status(400).send({ status: 0, message: "Los campos 'name', 'price' y 'description' son obligatorios." });
        }

   
        const existingProduct = await manager.getProductById(productId);

        if (!existingProduct) {
            return res.status(404).send({ status: 0, message: "Producto no encontrado" });
        }

        
        const updatedProduct = {
            id: existingProduct.id,
            title: title,
            price: price,
            description: description,
            thumbnails: thumbnails || existingProduct.thumbnails, 
        };
        await manager.updateProduct(productId, updatedProduct);

        res.send({ status: 1, message: "Producto actualizado correctamente", payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al actualizar el producto" });
    }
});


router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;

        await manager.deleteProduct(productId);

        res.send({ status: 1, message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al eliminar el producto" });
    }
});
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}


export default router