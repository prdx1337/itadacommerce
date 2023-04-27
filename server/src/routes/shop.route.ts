import express, { Router, Request, Response } from "express";
import ShopController from "../controllers/shop.controller";
import AuthService from "../services/auth.service";
import { OK } from "../utils/constant.util";
const ShopRouter: Router = express.Router();

ShopRouter.get("/shops-and-items", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.shopsAnditems();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.get("/shops", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.shops();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.get("/active-shops", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.activeShops();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.get("/shops/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.oneShop(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.post("/add-shop", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.create(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.put("/update-shop", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.update(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.put("/activate-shop", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.isActive(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ShopRouter.delete("/delete-shop/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ShopController.delete(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

export default ShopRouter;
