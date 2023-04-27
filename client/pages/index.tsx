import { Box, Button, Code, Flex } from "@chakra-ui/react";
import PrivateRoute from "@components/PrivateRoute";
import { logout, selectAuth } from "@redux/features/authSlice";
import { useAppDispatch } from "@redux/hooks";
import { authApi } from "@redux/services/authApi";
import { cartApi } from "@redux/services/cartApi";
import { shopApi } from "@redux/services/shopApi";
import { transactionApi } from "@redux/services/transactionApi";
import { userApi } from "@redux/services/userApi";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Home: NextPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { username } = useSelector(selectAuth);

    const handleLogout = () => {
        // Log out the user
        // ...
        dispatch(logout());
        router.push("/login");
        // Reset the caches for the shopApi, productsApi, and cartApi slices
        dispatch(shopApi.util.resetApiState());
        dispatch(userApi.util.resetApiState());
        dispatch(authApi.util.resetApiState());
        dispatch(cartApi.util.resetApiState());
        dispatch(transactionApi.util.resetApiState());
    };

    return (
        <PrivateRoute>
            <Box w={"calc(100vw"} h={"calc(100vh)"}>
                <Flex>
                    <Box
                        as={Flex}
                        w={"sm"}
                        mx={"auto"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        gap={3}>
                        <Code fontSize={"md"}>
                            console.log("welcome", {username})
                        </Code>

                        <Button
                            as={Code}
                            variant={"unstyled"}
                            cursor={"pointer"}
                            onClick={() => handleLogout()}>
                            logout
                        </Button>
                    </Box>
                </Flex>
            </Box>
        </PrivateRoute>
    );
};

export default Home;
