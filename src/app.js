import { promises as fs } from 'fs';

class ProductManager {
    constructor() {
        this.products = [];
        this.FirstId = 1;
    }


    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            console.error("El código de producto ya existe.");
            return;
        }

        const newProduct = {
            id: ++this.FirstId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        this.products.push(newProduct);
        console.log("Producto agregado:", newProduct);

        await this.saveProductsToFile(); 
    }

    async getProducts(limit) {
        await this.loadProductsFromFile(); 
        if (limit > 0) {
            return this.products.slice(0, limit); 
        } else {
            return this.products; 
        }
    }
    

    async getProductById(id) {
        await this.loadProductsFromFile(); 
        const product = this.products.find(product => product.id === +id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        await this.loadProductsFromFile(); 
        const productIndex = this.products.findIndex(product => product.id === +id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            console.log("Producto actualizado:", this.products[productIndex]);
            await this.saveProductsToFile(); 
        } else {
            console.error("Producto no encontrado.");
        }
    }

    async deleteProduct(id) {
        await this.loadProductsFromFile(); 
        const productIndex = this.products.findIndex(product => product.id === +id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            console.log("Producto eliminado correctamente.");
            await this.saveProductsToFile(); 
        } else {
            console.error("Producto no encontrado.");
        }
    }

    async saveProductsToFile() {
        try {
            await fs.writeFile('products.json', JSON.stringify(this.products, null, 2));
            console.log("Productos guardados en el archivo.");
        } catch (error) {
            console.error("Error al guardar productos en el archivo:", error);
        }
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.readFile('products.json', 'utf8');
            this.products = JSON.parse(data);
            console.log("Productos cargados desde el archivo.");
        } catch (error) {
            console.error("Error al cargar productos desde el archivo:", error);
        }
    }
}

export default ProductManager;

 const productManager = new ProductManager();
productManager.addProduct("Zapatillas deportivas", "Blancas", 20000, "zapasblancas.jpg", "COD001", 100);
productManager.addProduct("Zapatillas deportivas", "Negras", 15000, "negras.jpg", "COD002", 50);


productManager.getProducts().then(products => console.log("Todos los productos:", products));

productManager.getProductById(1).then(product => console.log("Producto encontrado por ID:", product));


productManager.updateProduct(1, { price: 25000 }); 

productManager.deleteProduct(); 


const test = async () => {

    await productManager.addProduct("Zapatillas de salir", "Rayadas", 24000, "rayadas.jpg", "COD003", 200);

    await productManager.addProduct("Zapatillas de salir", "Lisas", 35000, "lisas.jpg", "COD004", 70);

    const products = await productManager.getProducts();

    console.log("Todos los productos:", products);

    const product = await productManager.getProductById(2);

    console.log("Producto encontrado por ID:", product);

   await productManager.updateProduct(2, { price: 20000 });

    await productManager.deleteProduct();

    const productsAfterDelete = await productManager.getProducts();

    console.log("Todos los productos después de eliminar:", productsAfterDelete);

}

test();