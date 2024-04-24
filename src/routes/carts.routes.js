import { Router } from "express";
import fs from "fs";

const router = Router();
const cartsFilePath = "./src/carts.json";


function loadCartsData() {
    try {
        const cartsData = fs.readFileSync(cartsFilePath, "utf8");
        return JSON.parse(cartsData);
    } catch (error) {
        return [];
    }
}


function saveCartsData(data) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2), "utf8");
}


router.get("/:cid", (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartsData = loadCartsData();

        const cart = cartsData.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).send({ status: 0, message: "Carrito no encontrado" });
        }

        res.send({ status: 1, payload: cart.products });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al obtener productos del carrito" });
    }
});

router.post("/", (req, res) => {
    try {
        const newCart = {
            id: generateUniqueId(),
            products: []
        };

        const cartsData = loadCartsData();
        cartsData.push(newCart);
        saveCartsData(cartsData);

        res.status(201).send({ status: 1, message: "Carrito creado correctamente", payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al crear carrito" });
    }
});

router.post("/:cid/product/:pid", (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cartsData = loadCartsData();
        const cartIndex = cartsData.findIndex(cart => cart.id === cartId);

        if (cartIndex === -1) {
            return res.status(404).send({ status: 0, message: "Carrito no encontrado" });
        }

        const cart = cartsData[cartIndex];
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ productId: productId, quantity: 1 });
        }

        saveCartsData(cartsData);

        res.send({ status: 1, message: "Producto agregado al carrito correctamente", payload: cart.products });
    } catch (error) {
        res.status(500).send({ status: 0, message: "Error al agregar producto al carrito" });
    }
});

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}


export default router;
