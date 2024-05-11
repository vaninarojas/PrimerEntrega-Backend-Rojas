import { Router } from "express";
import fs from "fs";



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


router.get('/realTimeList', (req, res) => {
    res.render('realTimeProducts');
});

export default router