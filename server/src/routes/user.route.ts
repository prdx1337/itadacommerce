import express, { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";
import AuthService from "../services/auth.service";
import { OK } from "../utils/constant.util";
const UserRouter: Router = express.Router();

UserRouter.get("/users", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await UserController.users();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

UserRouter.post("/login", async (req: Request, res: Response) => {
    let response = await UserController.login(req.body);
    res.status(response.status).send(response);
});

UserRouter.post("/signup", async (req: Request, res: Response) => {
    let response = await UserController.signup(req.body);
    res.status(response.status).send(response);
});

UserRouter.put("/update-user", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await UserController.update(req.body);
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

UserRouter.delete("/delete-user/:id", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await UserController.delete(parseInt(req.params.id));
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

export default UserRouter;
