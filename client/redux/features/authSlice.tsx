import { RootState } from "@redux/store";
import { AuthState } from "@redux/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
    id: null,
    username: null,
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userSet: (state, action) => {
            const { id, username } = action.payload.response;
            const { token } = action.payload.response.token;
            localStorage.setItem(
                "user",
                JSON.stringify({ id, username, token })
            );
            state.id = id;
            state.username = username;
            state.token = token;
        },

        logout: (state) => {
            localStorage.clear();
            localStorage.removeItem("persist:root");
            Object.assign(state, {
                id: null,
                username: null,
                token: null,
            });
        },
    },
});

export const { userSet, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
