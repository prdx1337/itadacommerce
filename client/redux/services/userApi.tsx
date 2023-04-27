import { RootState } from "@redux/store";
import { Users } from "@redux/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
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

    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getUsers: builder.query<Users[], void>({
            query: () => "/users",
            transformResponse: (data: any) => data.response,
            providesTags: (result, error, arg) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Users" as const,
                              id,
                          })),
                          "Users",
                      ]
                    : ["Users"],
        }),

        addUsers: builder.mutation<void, Users>({
            query: (data) => ({
                url: "/signup",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        updateUsers: builder.mutation<void, Users>({
            query: ({ ...data }) => ({
                url: `/update-user`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        deleteUsers: builder.mutation({
            query: (id) => ({
                url: `/delete-user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Users", id: arg.id },
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useAddUsersMutation,
    useUpdateUsersMutation,
    useDeleteUsersMutation,
} = userApi;
