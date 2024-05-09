import express from "express";
import handlebars from "express-handlebars"
import config from "./config.js"
import productroutes from "./routes/products.routes.js"
import cartroutes from "./routes/carts.routes.js"
import viewsRouter from "./routes/views.routes.js"
import { Server } from "socket.io";


const app = express();
const httpServer = app.listen(config.PORT, () => {
    console.log(`App activa en puerto ${config.PORT}`);
});


const socketServer = new Server(httpServer);
app.set('socketServer', socketServer);


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



socketServer.on('connection', client => {
    console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

    client.on('newMessage', data => {
        console.log(`Mensaje recibido desde ${client.id}: ${data}`);
        client.emit('newMessageConfirmation', 'OK');
    });
});
