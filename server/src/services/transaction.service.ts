import Cart from "../models/tables/Cart";
import CommonResponse from "../utils/response.util";
import { Op } from "sequelize";

import { AddTransactionDTO } from "../models/dto/TransactionDTO";
import Shop from "../models/tables/Shop";
import Transaction from "../models/tables/Transaction";
import {
    OK,
    UPDATE,
    BADREQUEST,
    INTERNAL_SERVER_ERROR,
    NOTFOUND,
} from "../utils/constant.util";
import {
    INTERNAL_SERVER_ERROR_MESSAGE,
    OK_MESSAGE,
} from "../utils/message.util";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY ?? "", {
    apiVersion: "2022-11-15",
});

class TransactionService extends CommonResponse {
    //create
    // async createTr(dto: AddTransactionDTO["requestObject"]) {
    //     try {
    //         //cart items is zero
    //         let existCart = await Cart.findOne({
    //             where: { id: dto.cart_id },
    //             attributes: { exclude: ["createdAt", "updatedAt"] },
    //         });

    //         if (existCart?.id == 0) {
    //             return this.RESPONSE(OK, existCart, 0, "Cart items is zero.");
    //         }

    //         //transaction in progress
    //         let status = await Transaction.findOne<any>({
    //             where: {
    //                 transaction_status: {
    //                     [Op.iLike]: `%${dto.transaction_status}%`,
    //                 },
    //             },
    //             attributes: { exclude: ["createdAt", "updatedAt"] },
    //         });

    //         if (status) {
    //             return this.RESPONSE(
    //                 OK,
    //                 status,
    //                 0,
    //                 "Transaction is still ongoing."
    //             );
    //         }

    //         //check if shop is available
    //         let active = await Shop.findOne({
    //             where: { [Op.and]: [{ id: dto.shop_id }, { is_active: true }] },
    //         });

    //         if (!active) {
    //             return this.RESPONSE(
    //                 OK,
    //                 active,
    //                 0,
    //                 "Transaction failed because shop is deactivated/not exist."
    //             );
    //         }

    //         let date = await Transaction.findAll({
    //             attributes: [
    //                 "id",
    //                 [
    //                     sequelize.fn(
    //                         "date_format",
    //                         sequelize.col("date_col"),
    //                         "%Y-%m-%d"
    //                     ),
    //                     "date_col_formed",
    //                 ],
    //             ],
    //         });

    //         let exist = await Transaction.findOne();
    //         let count: number = await Transaction.count();

    //         if (exist != null) {
    //             let response = await Transaction.create({
    //                 ...dto,

    //                 transaction_date: date,
    //                 transaction_status: status,
    //                 is_active: true,
    //             });

    //             if (response !== null) {
    //                 return this.RESPONSE(
    //                     OK,
    //                     response,
    //                     count,
    //                     "Added to transaction."
    //                 );
    //             } else {
    //                 return this.RESPONSE(
    //                     BADREQUEST,
    //                     {},
    //                     0,
    //                     "Failed to add transaction."
    //                 );
    //             }
    //         } else {
    //             return this.RESPONSE(OK, exist, 0, "Transaction not exist.");
    //         }
    //     } catch (error) {
    //         return this.RESPONSE(
    //             INTERNAL_SERVER_ERROR,
    //             error,
    //             0,
    //             INTERNAL_SERVER_ERROR_MESSAGE
    //         );
    //     }
    // }

    //cart
    async transactions() {
        try {
            let exist = await Cart.findAll();
            let count: number = await Cart.count();
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, "Transactions found.");
            } else {
                return this.RESPONSE(NOTFOUND, [], 0, "No transaction found.");
            }
        } catch (error) {
            return this.RESPONSE(
                INTERNAL_SERVER_ERROR,
                error,
                0,
                INTERNAL_SERVER_ERROR_MESSAGE
            );
        }
    }

    //remove by id
    async deleteTr(dto: AddTransactionDTO["requestObject"]) {
        try {
            let exist = await Transaction.findOne({ where: { id: dto } });
            let count: number = await Transaction.count();
            if (exist != null) {
                let removeData = await Transaction.destroy({
                    where: { id: dto },
                });
                if (removeData != null) {
                    return this.RESPONSE(OK, {}, count, "Transaction deleted.");
                } else {
                    return this.RESPONSE(
                        BADREQUEST,
                        {},
                        0,
                        "Failed to delete transaction."
                    );
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, "Transaction not found.");
            }
        } catch (error) {
            return this.RESPONSE(
                INTERNAL_SERVER_ERROR,
                error,
                0,
                INTERNAL_SERVER_ERROR_MESSAGE
            );
        }
    }

    //update
    async updateTr(dto: AddTransactionDTO["requestObject"]) {
        try {
            let exist = await Transaction.findOne({ where: { id: dto.id } });
            let count: number = await Transaction.count();
            if (exist != null) {
                let updateData = await Transaction.update(dto, {
                    where: { id: dto.id },
                });
                if (updateData != null) {
                    return this.RESPONSE(
                        UPDATE,
                        updateData,
                        count,
                        "Item information updated."
                    );
                } else {
                    return this.RESPONSE(
                        BADREQUEST,
                        {},
                        0,
                        "Failed to update transaction."
                    );
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, "Transaction not found.");
            }
        } catch (error) {
            return this.RESPONSE(
                INTERNAL_SERVER_ERROR,
                error,
                0,
                INTERNAL_SERVER_ERROR_MESSAGE
            );
        }
    }

    async checkout(dto: any["requestObject"]) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                shipping_address_collection: {
                    allowed_countries: ["US", "CA", "KE"],
                },
                shipping_options: [
                    {
                        shipping_rate_data: {
                            type: "fixed_amount",
                            fixed_amount: {
                                amount: 0,
                                currency: "usd",
                            },
                            display_name: "Free shipping",
                            // Delivers between 5-7 business days
                            delivery_estimate: {
                                minimum: {
                                    unit: "business_day",
                                    value: 5,
                                },
                                maximum: {
                                    unit: "business_day",
                                    value: 7,
                                },
                            },
                        },
                    },
                    {
                        shipping_rate_data: {
                            type: "fixed_amount",
                            fixed_amount: {
                                amount: 1500,
                                currency: "usd",
                            },
                            display_name: "Next day air",
                            // Delivers in exactly 1 business day
                            delivery_estimate: {
                                minimum: {
                                    unit: "business_day",
                                    value: 1,
                                },
                                maximum: {
                                    unit: "business_day",
                                    value: 1,
                                },
                            },
                        },
                    },
                ],
                phone_number_collection: {
                    enabled: true,
                },
                line_items: dto.map((item: any) => {
                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: item.product.product_name,
                            },
                            unit_amount: item.product.price * 100,
                        },
                        quantity: item.quantity,
                    };
                }),

                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/checkout-success`,
                cancel_url: `${process.env.CLIENT_URL}/products`,
            });

            if (session) {
                return this.RESPONSE(OK, { url: session.url }, 0, OK_MESSAGE);
            }
        } catch (error) {
            return this.RESPONSE(
                INTERNAL_SERVER_ERROR,
                error,
                0,
                INTERNAL_SERVER_ERROR_MESSAGE
            );
        }
    }
}

export default new TransactionService();
