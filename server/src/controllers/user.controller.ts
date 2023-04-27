import UserService from "../services/user.service";

class UserController {
  async users() {
    let response = await UserService.users();
    return response;
  }

  async login(dto: any) {
    let response = await UserService.login(dto);
    return response;
  }

  async signup(dto: any) {
    let response = await UserService.signup(dto);
    return response;
  }

  async update(dto: any) {
    let response = await UserService.update(dto);
    return response;
  }

  async delete(dto: any) {
    let response = await UserService.delete(dto);
    return response;
  }
}

export default new UserController();
