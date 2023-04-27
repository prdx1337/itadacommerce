export interface Users {
    id: number;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface Shops {
    id: number;
    name: string;
    address: string;
    business_type: string;
    is_active: boolean | null;
    products: Products[];
}

export interface Products {
    id: number;
    shop_id: number;
    product_name: string;
    price: number;
    is_active: boolean;
    shop: {
        is_active: boolean;
        name: string;
    }[];
}

export interface Carts {
    id: number;
    user_id: number;
    shop_id: number;
    product_id: number;
    is_active: boolean;
    product: Products;
    quantity: number;
}

export interface AuthState {
    id: string | null;
    username: string | null;
    token: string | null;
}
