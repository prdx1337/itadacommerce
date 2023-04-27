import express, { Router, Request, Response } from "express";
import ProductController from "../controllers/product.controller";
import AuthService from "../services/auth.service";
import { OK } from "../utils/constant.util";
const ProductRouter: Router = express.Router();

ProductRouter.get("/products", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.products();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.get("/active-products", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.activeProducts();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.get("/products/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.oneProduct(
            parseInt(req.params.id)
        );
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.post("/add-product", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.create(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.put("/update-product", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.update(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.put("/activate-product", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await ProductController.isActive(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

ProductRouter.delete(
    "/delete-product/:id",
    async (req: Request, res: Response) => {
        let authenticate = await AuthService.verify(
            req.headers["authorization"]
        );
        if (authenticate.status == OK) {
            let response = await ProductController.delete(
                parseInt(req.params.id)
            );
            res.status(response.status).send(response);
        } else {
            return res.status(authenticate.status).send(authenticate);
        }
    }
);

export default ProductRouter;
