import ProductService from "../services/product.service";

class ShopController {
  async products() {
    let response = await ProductService.products();
    return response;
  }

  async activeProducts() {
    let response = await ProductService.activeProducts();
    return response;
  }

  async oneProduct(dto: any) {
    let response = await ProductService.oneProduct(dto);
    return response;
  }

  async create(dto: any) {
    let response = await ProductService.create(dto);
    return response;
  }

  async update(dto: any) {
    let response = await ProductService.update(dto);
    return response;
  }

  async isActive(dto: any) {
    let response = await ProductService.isActive(dto);
    return response;
  }

  async delete(dto: any) {
    let response = await ProductService.delete(dto);
    return response;
  }
}

export default new ShopController();
