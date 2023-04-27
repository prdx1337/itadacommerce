import { Op } from "sequelize";
import { AddShopDTO } from "../models/dto/ShopDTO";
import Product from "../models/tables/Product";
import Shop from "../models/tables/Shop";
import {
    BADREQUEST,
    INTERNAL_SERVER_ERROR,
    NOTFOUND,
    OK,
    UPDATE,
} from "../utils/constant.util";
import {
    BADREQUEST_MESSAGE,
    CREATED_MESSAGE,
    DELETE_MESSAGE,
    INTERNAL_SERVER_ERROR_MESSAGE,
    NOTFOUND_MESSAGE,
    SHOP_EXIST,
    SHOP_FOUND,
    UPDATE_MESSAGE,
} from "../utils/message.util";
import CommonResponse from "../utils/response.util";

class ShopService extends CommonResponse {
    //get all shop with products
    async shopsAnditems() {
        try {
            let exist = await Shop.findAll({
                include: {
                    model: Product,
                    attributes: ["product_name", "price", "is_active"],
                },
                attributes: { exclude: ["createdAt", "updatedAt"] },
                order: [["id", "ASC"]],
            });
            let count: number = await Shop.count();
            if (exist.length !== 0) {
                return this.RESPONSE(OK, exist, count, SHOP_FOUND);
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

    //get shops
    async shops() {
        try {
            let exist = await Shop.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            let count: number = await Shop.count();
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, SHOP_FOUND);
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

    //get all active shop
    async activeShops() {
        try {
            let exist = await Shop.findAll({
                where: { is_active: true },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            let count: number = await Shop.count({
                where: { is_active: true },
            });
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, SHOP_FOUND);
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

    //get one shop
    async oneShop(dto: AddShopDTO["requestObject"]) {
        try {
            let exist = await Shop.findOne({
                where: { [Op.and]: [{ id: dto }, { is_active: true }] },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            let count: number = await Shop.count({
                where: { [Op.and]: [{ id: dto }, { is_active: true }] },
            });
            if (exist !== null) {
                return this.RESPONSE(OK, exist, count, SHOP_FOUND);
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

    //create
    async create(dto: AddShopDTO["requestObject"]) {
        try {
            let exist = await Shop.findOne({
                where: { name: dto.name },
            });
            let count: number = await Shop.count();
            if (exist == null) {
                let response = await Shop.create({ ...dto });
                if (response !== null) {
                    return this.RESPONSE(OK, response, count, CREATED_MESSAGE);
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(OK, exist, 0, SHOP_EXIST);
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
    async update(dto: AddShopDTO["requestObject"]) {
        try {
            let exist = await Shop.findOne({
                where: { id: dto.id },
            });
            let count: number = await Shop.count();
            if (exist != null) {
                let updateData = await Shop.update(dto, {
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

    //new activate and de-activate
    async isActive(dto: AddShopDTO["requestObject"]) {
        try {
            let exist = await Shop.findOne({
                where: { id: dto.id },
            });
            let count: number = await Shop.count();
            if (exist != null) {
                let updateData = await Shop.update(
                    { id: dto.id, is_active: dto.is_active },
                    {
                        where: { id: dto.id },
                    }
                );
                // Update associated products
                await Product.update(
                    { is_active: dto.is_active },
                    {
                        where: { shop_id: dto.id },
                    }
                );
                if (updateData != null) {
                    return this.RESPONSE(
                        UPDATE,
                        updateData,
                        count,
                        "Shop and associated products status changed."
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

    //delete
    async delete(dto: AddShopDTO["requestObject"]) {
        try {
            let exist = await Shop.findOne({
                where: { id: dto },
            });
            // Find all Products associated with the deleted Shop
            let products = await Product.findAll({
                where: { shop_id: dto },
            });
            let count: number = await Shop.count();
            if (exist != null) {
                let removeData = await Shop.destroy({
                    where: { id: dto },
                });
                if (removeData != null) {
                    // Update the is_active property of each Product to false
                    for (let product of products) {
                        // await product.destroy();
                        await product.update({ is_active: false });
                    }
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
}

export default new ShopService();
