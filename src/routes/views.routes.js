import { Router } from "express";
import fs from "fs";
import { Server } from "socket.io";


const router = Router();

router.get('/listado', (req, res) => {
    fs.readFile('products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        
        try {
            
            const products = JSON.parse(data);
            
          
            res.render('home', { products });
        } catch (error) {
            console.error('Error al parsear los datos del archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});


router.get('/realtimeproducts', (req, res) => {
    fs.readFile('products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        
        try {
            const products = JSON.parse(data);
            res.render('realtimeproducts', { products });
        } catch (error) {
            console.error('Error al parsear los datos del archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});

const io = new Server();

io.on('connection', (socket) => {
    console.log('Cliente conectado');

  
    fs.readFile('products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return;
        }
        
        try {
            const products = JSON.parse(data);
            socket.emit('products', products);
        } catch (error) {
            console.error('Error al parsear los datos del archivo JSON:', error);
        }
    });
});


export default router