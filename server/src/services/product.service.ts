import CommonResponse from "../utils/response.util";
import Product from "../models/tables/Product";
import { Op } from "sequelize";
import { AddProductDTO } from "../models/dto/ProductDTO";
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
    PRODUCT_EXIST,
    PRODUCT_FOUND,
    UPDATE_MESSAGE,
} from "../utils/message.util";

class ShopService extends CommonResponse {
    //get all product
    async products() {
        try {
            let exist = await Product.findAll({
                include: {
                    model: Shop,
                    attributes: ["name", "is_active"],
                },
                attributes: { exclude: ["createdAt", "updatedAt"] },
                order: [["id", "ASC"]],
            });
            let count: number = await Product.count();
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, PRODUCT_FOUND);
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

    //get all active product
    async activeProducts() {
        try {
            let exist = await Product.findAll({
                where: { is_active: true },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            let count: number = await Product.count({
                where: { is_active: true },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, PRODUCT_FOUND);
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

    //get one product
    async oneProduct(dto: AddProductDTO["requestObject"]) {
        try {
            let exist = await Product.findOne({
                where: { [Op.and]: [{ id: dto }, { is_active: true }] },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            let count: number = await Product.count({
                where: { [Op.and]: [{ id: dto }, { is_active: true }] },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            if (exist !== null) {
                return this.RESPONSE(OK, exist, count, PRODUCT_FOUND);
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
    async create(dto: AddProductDTO["requestObject"]) {
        try {
            let exist = await Product.findOne({
                where: { product_name: dto.product_name },
            });
            let count: number = await Product.count();
            if (exist == null) {
                let response = await Product.create({ ...dto });
                if (response !== null) {
                    return this.RESPONSE(OK, response, count, CREATED_MESSAGE);
                } else {
                    return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
                }
            } else {
                return this.RESPONSE(OK, exist, 0, PRODUCT_EXIST);
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
    async update(dto: AddProductDTO["requestObject"]) {
        try {
            let exist = await Product.findOne({ where: { id: dto.id } });
            let count: number = await Product.count();
            if (exist != null) {
                let updateData = await Product.update(dto, {
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

    //activate and de-activate
    async isActive(dto: AddProductDTO["requestObject"]) {
        try {
            let exist = await Product.findOne({ where: { id: dto.id } });
            let count: number = await Product.count();
            if (exist != null) {
                let updateData = await Product.update(
                    { id: dto.id, is_active: dto.is_active },
                    {
                        where: { id: dto.id },
                    }
                );
                if (updateData != null) {
                    return this.RESPONSE(
                        UPDATE,
                        updateData,
                        count,
                        "Product state changed."
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
    async delete(dto: AddProductDTO["requestObject"]) {
        try {
            let exist = await Product.findOne({ where: { id: dto } });
            let count: number = await Product.count();
            if (exist != null) {
                let removeData = await Product.destroy({ where: { id: dto } });
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
}

export default new ShopService();
