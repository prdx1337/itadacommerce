import express, { Router, Request, Response } from "express";
import CartController from "../controllers/cart.controller";
import AuthService from "../services/auth.service";
import { OK } from "../utils/constant.util";
const CartRouter: Router = express.Router();

CartRouter.post("/add-to-cart", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.addTocart(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

CartRouter.get("/cart/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.cart(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

CartRouter.delete("/remove-item/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.deleteItem(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

CartRouter.delete("/empty-cart/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.emptyCart(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

CartRouter.put("/update-item", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.updateItem(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

CartRouter.put("/patch-item", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await CartController.updateCartItem(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

export default CartRouter;
