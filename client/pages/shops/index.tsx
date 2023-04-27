import {
    Box,
    Button,
    Center,
    Heading,
    SimpleGrid,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import AddShopModal from "@components/Modal/AddShopModal";
import PrivateRoute from "@components/PrivateRoute";
import { ShopTable } from "@components/ShopTable";
import { customToast } from "@components/Toast";
import { useAddShopsMutation, useGetShopsQuery } from "@redux/services/shopApi";
import { Shops } from "@redux/types";
import { NextPage } from "next";
import { SubmitHandler } from "react-hook-form";

const Shop: NextPage = () => {
    const { data: shops, isFetching: shopFetching } = useGetShopsQuery();
    const [addShops] = useAddShopsMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { newToast } = customToast();

    const onSubmit: SubmitHandler<Shops> = async (data) => {
        try {
            const result: any = await addShops(data).unwrap();
            const { message } = result;
            onClose();
            newToast({ message: message, type: "success" });
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    return (
        <PrivateRoute>
            <Box w={"full"}>
                <Box w={"80%"} mx={"auto"}>
                    <Center>
                        <Button
                            onClick={onOpen}
                            colorScheme="facebook"
                            children="Add shop ?"
                            borderRadius={0}
                            m={4}
                        />
                        {shopFetching && <Spinner />}
                    </Center>
                    <SimpleGrid
                        columns={[1, null, null, 2, 3, 4]}
                        spacing={2}
                        placeItems={"center"}>
                        {shops ? (
                            shops.map((s, k) => (
                                <ShopTable
                                    id={s.id}
                                    name={s.name}
                                    address={s.address}
                                    business_type={s.business_type}
                                    is_active={s.is_active}
                                    products={s.products}
                                    key={k}
                                />
                            ))
                        ) : (
                            <Heading
                                children="Shops are unavailable"
                                size="2xl"
                                fontStyle={"italic"}
                            />
                        )}
                    </SimpleGrid>
                    <AddShopModal
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </Box>
            </Box>
        </PrivateRoute>
    );
};

export default Shop;
