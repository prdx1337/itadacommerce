import { RootState } from "@redux/store";
import { Carts } from "@redux/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    keepUnusedDataFor: 0,
    tagTypes: ["Carts", "Shops"],

    endpoints: (builder) => ({
        getCarts: builder.query<Carts[], void>({
            query: (logged_in_user_id) => `/cart/${logged_in_user_id}`,
            transformResponse: (data: any) => data.response,

            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: "Carts", id } as const)
                          ),
                          { type: "Carts", id: "LIST" },
                      ]
                    : [{ type: "Carts", id: "LIST" }],
        }),

        addCarts: builder.mutation<void, Carts>({
            query: (data) => ({
                url: "/add-to-cart",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Carts", id: "LIST" }],
        }),

        updateCarts: builder.mutation<void, Carts>({
            query: ({ ...data }) => ({
                url: "/update-item",
                method: "PUT",
                body: data,
            }),

            invalidatesTags: [{ type: "Carts", id: "LIST" }],
        }),

        updateCartItem: builder.mutation({
            query: ({ ...data }) => ({
                url: `/patch-item/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, data) => [{ type: "Carts", data }],
        }),

        deleteCarts: builder.mutation({
            query: (id) => ({
                url: `/remove-item/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Carts", id }],
        }),

        emptyCarts: builder.mutation({
            query: (logged_in_user_id) => ({
                url: `empty-cart/${logged_in_user_id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Carts", id: "LIST" }],
        }),
    }),
});

export const {
    useAddCartsMutation,
    useEmptyCartsMutation,
    useUpdateCartsMutation,
    useUpdateCartItemMutation,
    useDeleteCartsMutation,
    useGetCartsQuery,
} = cartApi;
