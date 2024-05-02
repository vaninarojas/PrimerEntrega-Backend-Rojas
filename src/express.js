import express from "express";
import handlebars from "express-handlebars"
import config from "./config.js"
import productroutes from "./routes/products.routes.js"
import cartroutes from "./routes/carts.routes.js"
import viewsRouter from "./routes/views.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
console.log(config.DIRNAME)
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');

app.use ("/", viewsRouter)
app.use("/api/products", productroutes);
app.use("/api/carts", cartroutes);
app.use("/static", express.static(`${config.DIRNAME}/public`));


app.listen(config.PORT, () => {
    console.log(`Servidor activo en puerto ${config.PORT}`);
 
});
