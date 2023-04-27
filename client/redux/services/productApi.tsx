import { RootState } from "@redux/store";
import { Products } from "@redux/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
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
    // refetchOnFocus: true,
    // refetchOnReconnect: true,
    // refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 0,
    tagTypes: ["Products"],

    endpoints: (builder) => ({
        getProducts: builder.query<Products[], void>({
            query: () => "/products",
            transformResponse: (data: any) => data.response,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: "Products", id } as const)
                          ),
                          { type: "Products", id: "LIST" },
                      ]
                    : [{ type: "Products", id: "LIST" }],
        }),

        addProducts: builder.mutation<void, Products>({
            query: (data) => ({
                url: "/add-product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Products", id: "LIST" }],
        }),

        deleteProducts: builder.mutation({
            query: (id) => ({
                url: `/delete-product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Products", id }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useAddProductsMutation,
    useDeleteProductsMutation,
} = productApi;
