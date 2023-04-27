import { DeleteIcon, LockIcon, StarIcon, UnlockIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Heading,
    Icon,
    Img,
    Stack,
    Tag,
    TagLabel,
    TagLeftIcon,
    Text,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { DeleteDialog } from "@components/AlertDialog";
import { customToast } from "@components/Toast";
import "@public/macbook.jpg";
import { selectAuth } from "@redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { cartApi, useAddCartsMutation } from "@redux/services/cartApi";
import { useDeleteProductsMutation } from "@redux/services/productApi";
import { Products } from "@redux/types";
import React, { useRef } from "react";
import { SubmitHandler } from "react-hook-form";

export const ProductTable: React.FC<any> = ({
    id,
    shop_id,
    product_name,
    price,
    is_active,
    shop,
}) => {
    const [deleteProduct] = useDeleteProductsMutation();
    const [addToCart] = useAddCartsMutation();
    const { id: USER_ID } = useAppSelector(selectAuth);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const isDelete = useDisclosure();
    const { newToast } = customToast();
    const dispatch = useAppDispatch();

    const onDelete: SubmitHandler<Products> = async (id) => {
        try {
            const result: any = await deleteProduct(id).unwrap();
            const { message } = result;
            isDelete.onClose();
            dispatch(cartApi.util.resetApiState());
            newToast({ message: message, type: "success" });
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    const onCart = async () => {
        try {
            const payload: any = { product_id: id, user_id: USER_ID, shop_id };
            const result: any = await addToCart(payload).unwrap();
            const { message } = result;
            newToast({ message: message, type: "success" });
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    return (
        <>
            <Box
                maxW={"300px"}
                h={"full"}
                w={"full"}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"md"}
                rounded={"md"}
                p={4}
                mx={"auto"}>
                <Box bg={"gray.100"}>
                    <Img
                        src={"shop.jpg"}
                        w={"full"}
                        minH={"auto"}
                        objectFit={"cover"}
                        objectPosition={"center"}
                        alt={"placeholder image"}
                    />
                </Box>
                <Stack>
                    <Tag variant="subtle" fontSize={10}>
                        <TagLeftIcon boxSize="6px" as={StarIcon} />
                        <TagLabel>{shop ? shop.name : "shop deleted"}</TagLabel>
                    </Tag>
                    <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}>
                        <Box w={3 / 4}>
                            <Heading
                                color={useColorModeValue("gray.700", "white")}
                                fontSize={"lg"}
                                fontWeight={"black"}
                                textTransform={"uppercase"}
                                noOfLines={1}>
                                {product_name}
                            </Heading>
                            <Text
                                color={"blue.600"}
                                fontWeight={"bold"}
                                fontSize={"xl"}>
                                ${price}
                            </Text>
                        </Box>
                        <Box>
                            {is_active ? (
                                <Icon as={UnlockIcon} textColor={"green.400"} />
                            ) : (
                                <Icon as={LockIcon} textColor={"gray.400"} />
                            )}

                            <Center height="15px">
                                <Divider orientation="vertical" />
                            </Center>
                            <DeleteIcon
                                onClick={isDelete.onOpen}
                                cursor={"pointer"}
                                textColor={"red.400"}
                            />
                        </Box>
                    </Flex>
                    <Divider />
                    <Button
                        fontSize={"sm"}
                        variant="ghost"
                        colorScheme="blue"
                        onClick={onCart}
                        isDisabled={!is_active}>
                        Add to cart
                    </Button>
                </Stack>
            </Box>
            <DeleteDialog
                onDelete={onDelete}
                isDelete={isDelete}
                product_name={product_name}
                id={id}
                cancelRef={cancelRef}
            />
        </>
    );
};
