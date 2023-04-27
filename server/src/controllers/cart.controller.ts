import CartService from "../services/cart.service";

class CartController {
    async addTocart(dto: any) {
        let response = await CartService.addTocart(dto);
        return response;
    }
    async cart(dto: any) {
        let response = await CartService.cart(dto);
        return response;
    }

    async deleteItem(dto: any) {
        let response = await CartService.deleteItem(dto);
        return response;
    }

    async emptyCart(dto: any) {
        let response = await CartService.emptyCart(dto);
        return response;
    }

    async updateItem(dto: any) {
        let response = await CartService.updateItem(dto);
        return response;
    }

    async updateCartItem(dto: any) {
        let response = await CartService.updateCartItem(dto);
        return response;
    }
}

export default new CartController();
