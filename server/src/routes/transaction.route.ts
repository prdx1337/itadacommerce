import express, { Router, Request, Response } from "express";
import TransactionController from "../controllers/transaction.controller";
import AuthService from "../services/auth.service";
import { OK } from "../utils/constant.util";
const TransactionRouter: Router = express.Router();

// TransactionRouter.post(
//     "/create-transaction",
//     async (req: Request, res: Response) => {
//         let authenticate = await AuthService.verify(
//             req.headers["authorization"]
//         );
//         if (authenticate.status == OK) {
//             let response = await TransactionController.createTr(req.body);
//             res.status(response.status).send(response);
//         } else {
//             return res.status(authenticate.status).send(authenticate);
//         }
//     }
// );

TransactionRouter.get("/transactions", async (req: Request, res: Response) => {
    let authenticate = await AuthService.verify(req.headers["authorization"]);
    if (authenticate.status == OK) {
        let response = await TransactionController.transactions();
        res.status(response.status).send(response);
    } else {
        return res.status(authenticate.status).send(authenticate);
    }
});

TransactionRouter.delete(
    "/delete-transaction/:id",
    async (req: Request, res: Response) => {
        let authenticate = await AuthService.verify(
            req.headers["authorization"]
        );
        if (authenticate.status == OK) {
            let response = await TransactionController.deleteTr(
                parseInt(req.params.id)
            );
            res.status(response.status).send(response);
        } else {
            return res.status(authenticate.status).send(authenticate);
        }
    }
);

TransactionRouter.put(
    "/update-transaction",
    async (req: Request, res: Response) => {
        let authenticate = await AuthService.verify(
            req.headers["authorization"]
        );
        if (authenticate.status == OK) {
            let response = await TransactionController.updateTr(req.body);
            res.status(response.status).send(response);
        } else {
            return res.status(authenticate.status).send(authenticate);
        }
    }
);

TransactionRouter.post(
    "/create-checkout-session",
    async (req: Request, res: Response) => {
        let authenticate = await AuthService.verify(
            req.headers["authorization"]
        );
        if (authenticate.status == OK) {
            let response: any = await TransactionController.checkout(req.body);
            res.status(response.status).send(response);
        } else {
            return res.status(authenticate.status).send(authenticate);
        }
    }
);

export default TransactionRouter;
