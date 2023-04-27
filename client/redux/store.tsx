import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "redux/features/authSlice";
import { authApi } from "redux/services/authApi";
import { cartApi } from "redux/services/cartApi";
import { shopApi } from "redux/services/shopApi";
import { userApi } from "redux/services/userApi";
import { productApi } from "./services/productApi";
import { transactionApi } from "./services/transactionApi";

const reducers = combineReducers({
    auth: authReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
});

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        // getDefaultMiddleware({
        //     serializableCheck: false,
        //     immutableCheck: false,
        //     serializableCheck: {
        //         ignoredActions: [
        //             FLUSH,
        //             REHYDRATE,
        //             PAUSE,
        //             PERSIST,
        //             PURGE,
        //             REGISTER,
        //         ],
        //     },
        // })

        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(
            cartApi.middleware,
            userApi.middleware,
            authApi.middleware,
            shopApi.middleware,
            productApi.middleware,
            transactionApi.middleware
        ),
});

export let persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = ReturnType<typeof store.getState>;
export type ReduxStore = typeof store;

setupListeners(store.dispatch);
