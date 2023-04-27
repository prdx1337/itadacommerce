import { RootState } from "@redux/store";
import { Shops } from "@redux/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shopApi = createApi({
    reducerPath: "shopApi",
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
    tagTypes: ["Shops", "Products", "Carts"],

    endpoints: (builder) => ({
        getShops: builder.query<Shops[], void>({
            query: () => "/shops-and-items",
            transformResponse: (data: any) => data.response,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }) => ({ type: "Shops", id } as const)
                          ),
                          { type: "Shops", id: "LIST" },
                      ]
                    : [{ type: "Shops", id: "LIST" }],
        }),

        getActiveShops: builder.query<Shops[], void>({
            query: () => "/active-shops",
            transformResponse: (data: any) => data.response,
            providesTags: ["Shops"],
        }),

        addShops: builder.mutation<void, Shops>({
            query: (data) => ({
                url: "/add-shop",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Shops", id: "LIST" }],
        }),

        updateShops: builder.mutation<void, Shops>({
            query: ({ ...data }) => ({
                url: "/update-shop",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [{ type: "Shops", id: "LIST" }],
        }),

        activateShops: builder.mutation({
            query: ({ ...data }) => ({
                url: "/activate-shop",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, data) => [
                { type: "Shops", data },
                { type: "Products", id: "LIST" },
                { type: "Carts", id: "LIST" },
            ],
        }),

        deleteShops: builder.mutation({
            query: (id) => ({
                url: `/delete-shop/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Shops", id }],
        }),
    }),
});

export const {
    useGetShopsQuery,
    useGetActiveShopsQuery,
    useAddShopsMutation,
    useUpdateShopsMutation,
    useDeleteShopsMutation,
    useActivateShopsMutation,
} = shopApi;
