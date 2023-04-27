import { Op } from "sequelize";
import { AddCartDTO } from "../models/dto/CartDTO";
import Cart from "../models/tables/Cart";
import Product from "../models/tables/Product";
import Shop from "../models/tables/Shop";
import User from "../models/tables/User";
import CommonResponse from "../utils/response.util";
import {
    OK,
    CREATED,
    UPDATE,
    NOTFOUND,
    BADREQUEST,
    INTERNAL_SERVER_ERROR,
} from "../utils/constant.util";
import {
    OK_MESSAGE,
    CREATED_MESSAGE,
    UPDATE_MESSAGE,
    DELETE_MESSAGE,
    SEARCH_MESSAGE,
    NOTFOUND_MESSAGE,
    BADREQUEST_MESSAGE,
    INTERNAL_SERVER_ERROR_MESSAGE,
} from "../utils/message.util";
import express, { Request } from "express";
class CartService extends CommonResponse {
    //create
    async addTocart(dto: AddCartDTO["requestObject"]) {
        try {
            // Check if user/shop/product exists
            const user = await User.findOne({ where: { id: dto.user_id } });
            const shop = await Shop.findOne({
                where: {
                    [Op.and]: [{ id: dto.shop_id }, { is_active: true }],
                },
            });
            const product = await Product.findOne({
                where: {
                    [Op.and]: [{ id: dto.product_id }, { is_active: true }],
                },
            });
            //limit item to 5 per shop
            let cartLimit = await Cart.count({
                where: {
                    [Op.and]: [
                        { shop_id: dto.shop_id },
                        { user_id: dto.user_id },
                    ],
                },
            });

            //already in cart
            let userProdExist = await Cart.findOne({
                where: {
                    [Op.and]: [
                        { product_id: dto.product_id },
                        { user_id: dto.user_id },
                    ],
                },
            });
            //count
            let count: number = await Cart.count();

            if (!user) {
                return this.RESPONSE(
                    OK,
                    user,
                    0,
                    "The specified user could not be found."
                );
            }

            if (!shop) {
                return this.RESPONSE(
                    OK,
                    {},
                    0,
                    "The shop is currently unavailable."
                );
            }

            if (!product) {
                return this.RESPONSE(
                    OK,
                    {},
                    0,
                    "The product is currently unavailable."
                );
            }

            if (shop.id != product?.shop_id) {
                return this.RESPONSE(
                    OK,
                    {},
                    0,
                    "Please ensure all items are from the same shop."
                );
            }

            if (userProdExist) {
                return this.RESPONSE(
                    OK,
                    {},
                    0,
                    "This item has already been added to your cart."
                );
            }

            if (product && cartLimit < 5) {
                let response = await Cart.create({
                    ...dto,
                    user_id: user ? user.id : dto.user_id,
                    shop_id: shop ? shop.id : dto.shop_id,
                    product_id: product ? product.id : dto.product_id,
                    is_active: true,
                    quantity: 1,
                });

                if (response != null) {
                    return this.RESPONSE(
                        OK,
                        response,
                        count,
                        "The item was successfully added to your cart."
                    );
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(
                    OK,
                    {},
                    0,
                    "You have reached the maximum limit of 5 items from this shop."
                );
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

    //cart
    async cart(dto: AddCartDTO["requestObject"]) {
        try {
            let exist = await Cart.findAll({
                where: { user_id: dto },
                include: [
                    {
                        model: User,
                        attributes: ["id", "username"],
                    },
                    {
                        model: Product,
                        where: { is_active: true },
                        attributes: ["product_name", "price", "is_active"],
                        include: [
                            {
                                model: Shop,
                                attributes: ["name", "is_active"],
                            },
                        ],
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                order: [["id", "ASC"]],
            });
            console.log(dto);
            let count: number = await Cart.count();
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, OK_MESSAGE);
            } else {
                return this.RESPONSE(NOTFOUND, [], 0, NOTFOUND_MESSAGE);
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
    async deleteItem(dto: AddCartDTO["requestObject"]) {
        try {
            let exist = await Cart.findOne({ where: { id: dto } });
            let count: number = await Cart.count();
            if (exist != null) {
                let removeData = await Cart.destroy({ where: { id: dto } });
                if (removeData != null) {
                    return this.RESPONSE(OK, {}, count, DELETE_MESSAGE);
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
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

    //empty cart
    async emptyCart(dto: AddCartDTO["requestObject"]) {
        try {
            console.log("dto:", dto);
            let exist = await Cart.findAll({ where: { user_id: dto } });
            let count: number = await Cart.count();
            if (exist != null) {
                let removeData = await Cart.destroy({
                    where: { user_id: dto },
                });
                if (removeData != null) {
                    return this.RESPONSE(OK, {}, count, OK_MESSAGE);
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
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
    async updateItem(dto: AddCartDTO["requestObject"]) {
        try {
            let exist = await Cart.findOne({ where: { id: dto.id } });
            let count: number = await Cart.count();
            if (exist != null) {
                let updateData = await Cart.update(dto, {
                    where: { id: dto.id },
                });
                if (updateData != null) {
                    return this.RESPONSE(
                        UPDATE,
                        updateData,
                        count,
                        UPDATE_MESSAGE
                    );
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
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
    async updateCartItem(dto: AddCartDTO["requestObject"]) {
        try {
            let exist = await Cart.findOne({ where: { id: dto.id } });
            let count: number = await Cart.count();
            if (exist != null) {
                if (dto.quantity > 0) {
                    let patchQuantity = await Cart.update(
                        { quantity: dto.quantity },
                        {
                            where: { id: dto.id },
                        }
                    );

                    if (patchQuantity != null) {
                        return this.RESPONSE(
                            UPDATE,
                            patchQuantity,
                            count,
                            UPDATE_MESSAGE
                        );
                    } else {
                        return this.RESPONSE(
                            BADREQUEST,
                            {},
                            0,
                            BADREQUEST_MESSAGE
                        );
                    }
                } else {
                    return this.RESPONSE(
                        BADREQUEST,
                        {},
                        0,
                        "Quantity must be greater than 0"
                    );
                }
            } else {
                return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
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

export default new CartService();
