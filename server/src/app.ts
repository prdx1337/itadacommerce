import express, { json } from "express";
import dotenv, { DotenvConfigOutput } from "dotenv";
import config from "./config/config";
const app: express.Application = express();
const env_config: DotenvConfigOutput = dotenv.config();
const port = process.env.PORT || 5000;
import cors from "cors";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY ?? "", {
    apiVersion: "2022-11-15",
});

//routes
import UserRouter from "./routes/user.route";
import ShopRouter from "./routes/shop.route";
import ProductRouter from "./routes/product.route";
import CartRouter from "./routes/cart.route";
import TransactionRouter from "./routes/transaction.route";

//middleware
app.use(json());
app.use(cors());
app.use(UserRouter);
app.use(ShopRouter);
app.use(ProductRouter);
app.use(CartRouter);
app.use(TransactionRouter);

//authentication
config
    .authenticate()
    .then(() => {
        config.sync({ force: process.env.RESET == "true" ? true : false });
        console.log("Connected to Database!");
    })
    .catch((err) => {
        console.log(err);
    });

//serve
let serve = async () => {
    config.authenticate();
    config.sync({ force: false });
    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
};

serve();
