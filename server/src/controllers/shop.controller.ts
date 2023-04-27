import ShopService from "../services/shop.service";

class ShopController {
  async shopsAnditems() {
    let response = await ShopService.shopsAnditems();
    return response;
  }

  async shops() {
    let response = await ShopService.shops();
    return response;
  }

  async activeShops() {
    let response = await ShopService.activeShops();
    return response;
  }

  async oneShop(dto: any) {
    let response = await ShopService.oneShop(dto);
    return response;
  }

  async create(dto: any) {
    let response = await ShopService.create(dto);
    return response;
  }

  async update(dto: any) {
    let response = await ShopService.update(dto);
    return response;
  }

  async isActive(dto: any) {
    let response = await ShopService.isActive(dto);
    return response;
  }

  async delete(dto: any) {
    let response = await ShopService.delete(dto);
    return response;
  }
}

export default new ShopController();
