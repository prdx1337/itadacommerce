import { userSet } from "@redux/features/authSlice";
import { RootState } from "@redux/store";
import { Users } from "@redux/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
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

    endpoints: (builder) => ({
        createUser: builder.mutation<void, Users>({
            query: (data) => ({
                url: "/signup",
                method: "POST",
                body: data,
            }),
        }),

        loginUser: builder.mutation<void, Users>({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
            // transformResponse: (data: Users) => data.response,
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userSet(data));
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/login",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
} = authApi;
