import { RootState } from "@redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
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

    tagTypes: ["Transactions"],
    endpoints: (builder) => ({
        transactions: builder.query<any[], void>({
            query: () => "/transactions",
            transformResponse: (data: any) => data.response,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(
                              ({ id }) =>
                                  ({ type: "Transactions", id } as const)
                          ),
                          { type: "Transactions", id: "LIST" },
                      ]
                    : [{ type: "Transactions", id: "LIST" }],
        }),

        checkout: builder.mutation<void, any>({
            query: (data) => ({
                url: "/create-checkout-session",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Transactions", id: "LIST" }],
        }),
    }),
});

export const { useTransactionsQuery, useCheckoutMutation } = transactionApi;
