import {
  BADREQUEST,
  INTERNAL_SERVER_ERROR,
  NOTFOUND,
  OK,
} from "../utils/constant.util";
import {
  BADREQUEST_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  NOTFOUND_MESSAGE,
  OK_MESSAGE,
} from "../utils/message.util";
import CommonResponse from "../utils/response.util";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

class AuthService extends CommonResponse {
  //authentication
  async auth(requestObject: any) {
    try {
      let authentication = jwt.sign(requestObject, process.env.SECRET_KEY);
      if (authentication != null) {
        return this.RESPONSE(OK, { token: authentication }, 0, OK_MESSAGE);
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

  //verification
  async verify(token: any) {
    try {
      if (token != null || token != undefined) {
        var getToken = token.split(" ")[1];

        if (getToken != null || getToken != undefined) {
          let verification = await jwt.verify(getToken, process.env.SECRET_KEY);
          if (verification != null) {
            return this.RESPONSE(OK, verification, 0, OK_MESSAGE);
          } else {
            return this.RESPONSE(BADREQUEST, {}, 0, BADREQUEST_MESSAGE);
          }
        } else {
          return this.RESPONSE(NOTFOUND, {}, 0, NOTFOUND_MESSAGE);
        }
      } else {
        return this.RESPONSE(BADREQUEST, {}, 0, "Token is not valid.");
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

export default new AuthService();
