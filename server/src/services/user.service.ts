import dotenv, { DotenvConfigOutput } from "dotenv";
import { AddUserDTO } from "../models/dto/UserDTO";
import User from "../models/tables/User";
import {
    BADREQUEST,
    INTERNAL_SERVER_ERROR,
    NOTFOUND,
    OK,
    UPDATE,
} from "../utils/constant.util";
import {
    BADREQUEST_MESSAGE,
    DELETE_MESSAGE,
    INTERNAL_SERVER_ERROR_MESSAGE,
    NOTFOUND_MESSAGE,
    OK_MESSAGE,
    UPDATE_MESSAGE,
    USER_EXIST,
    USER_FOUND,
} from "../utils/message.util";
import CommonResponse from "../utils/response.util";
import AuthService from "./auth.service";
const env_config: DotenvConfigOutput = dotenv.config();
const bcrypt = require("bcrypt");

class UserService extends CommonResponse {
    //get all users
    async users() {
        try {
            let exist = await User.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
                order: [["id", "ASC"]],
            });
            let count = await User.count();
            if (exist.length != 0) {
                return this.RESPONSE(OK, exist, count, USER_FOUND);
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

    //login
    async login(dto: AddUserDTO["requestObject"]) {
        try {
            let exist = await User.findOne({
                where: { username: dto.username },
            });

            if (exist != null) {
                let passwordConfirm = await bcrypt.compare(
                    dto.password,
                    exist.password
                );
                if (passwordConfirm == true) {
                    console.log(exist.password);
                    let token = await AuthService.auth(exist.password);

                    return this.RESPONSE(
                        OK,
                        {
                            token: token.response,
                            id: exist.id,
                            username: exist.username,
                        },
                        0,
                        "Signed in successfully."
                    );
                } else {
                    return this.RESPONSE(
                        BADREQUEST,
                        {},
                        0,
                        "Incorrect username or password."
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

    //signup
    async signup(dto: AddUserDTO["requestObject"]) {
        try {
            if (dto != null) {
                let exist = await User.findOne({
                    where: { username: dto.username },
                });

                if (exist != null) {
                    return this.RESPONSE(BADREQUEST, {}, 0, USER_EXIST);
                }
                if (dto.password == dto.confirmPassword) {
                    let hashPassword = await bcrypt.hash(dto.password, 10);

                    let response = await User.create({
                        ...dto,
                        username: dto.username,
                        password: hashPassword,
                    });

                    if (response != null) {
                        return this.RESPONSE(
                            OK,
                            response,
                            0,
                            "Signed up successfully."
                        );
                    } else {
                        return this.RESPONSE(
                            BADREQUEST,
                            {},
                            0,
                            "You have to input something."
                        );
                    }
                } else {
                    return this.RESPONSE(
                        BADREQUEST,
                        {},
                        0,
                        "Confirm password is incorrect."
                    );
                }
            } else {
                return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
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
    async update(dto: AddUserDTO["requestObject"]) {
        try {
            if (dto != null) {
                let exist = await User.findOne({ where: { id: dto.id } });
                if (exist != null) {
                    let hashPassword = await bcrypt.hash(dto.password, 10);

                    let updateData = await User.update(
                        {
                            id: dto.id,
                            username: dto.username,
                            password: hashPassword,
                        },
                        {
                            where: {
                                id: dto.id,
                            },
                        }
                    );

                    if (updateData != null) {
                        return this.RESPONSE(
                            UPDATE,
                            updateData,
                            0,
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
                    return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
                }
            } else {
                return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
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
    async delete(dto: AddUserDTO["requestObject"]) {
        try {
            let exist = await User.findOne({ where: { id: dto } });
            if (exist != null) {
                let removeData = await User.destroy({ where: { id: dto } });
                if (removeData != null) {
                    return this.RESPONSE(OK, {}, 0, DELETE_MESSAGE);
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

export default new UserService();
