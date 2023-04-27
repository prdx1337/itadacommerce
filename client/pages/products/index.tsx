import {
    Box,
    Button,
    Center,
    Heading,
    SimpleGrid,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import AddProductModal from "@components/Modal/AddProductModal";
import PrivateRoute from "@components/PrivateRoute";
import { ProductTable } from "@components/ProductTable";
import { customToast } from "@components/Toast";
import {
    useAddProductsMutation,
    useGetProductsQuery,
} from "@redux/services/productApi";
import { Products } from "@redux/types";
import { NextPage } from "next";
import { SubmitHandler } from "react-hook-form";

const Product: NextPage = () => {
    const { data: products, isFetching: productFetching } = useGetProductsQuery(
        undefined,
        { refetchOnMountOrArgChange: true }
    );
    const [addProduct] = useAddProductsMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { newToast } = customToast();

    const onSubmit: SubmitHandler<Products> = async (data) => {
        try {
            const result: any = await addProduct(data).unwrap();
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
                            children="Add product ?"
                            borderRadius={0}
                            m={4}
                        />
                        {productFetching && <Spinner />}
                    </Center>
                    <SimpleGrid
                        columns={[1, null, null, 2, 3, 4]}
                        spacing={2}
                        placeItems={"center"}>
                        {products ? (
                            products.map((s, i) => (
                                <ProductTable
                                    id={s.id}
                                    shop_id={s.shop_id}
                                    product_name={s.product_name}
                                    price={s.price}
                                    is_active={s.is_active}
                                    shop={s.shop}
                                    key={i}
                                />
                            ))
                        ) : (
                            <Heading
                                children="Products are unavailable"
                                size="2xl"
                                fontStyle={"italic"}
                            />
                        )}
                    </SimpleGrid>
                    <AddProductModal
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={onSubmit}
                    />
                </Box>
            </Box>
        </PrivateRoute>
    );
};

export default Product;
