import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    Heading,
    Img,
    InputGroup,
    InputLeftAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spinner,
    Tag,
    Text,
} from "@chakra-ui/react";
import { customToast } from "@components/Toast";
import { selectAuth } from "@redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
    cartApi,
    useDeleteCartsMutation,
    useEmptyCartsMutation,
    useGetCartsQuery,
    useUpdateCartItemMutation,
} from "@redux/services/cartApi";
import { useCheckoutMutation } from "@redux/services/transactionApi";
import { useRouter } from "next/router";
import { useRef } from "react";

interface ICart {
    isOpen: boolean;
    onClose: () => void;
}

const DrawerComponent: React.FC<ICart> = ({ isOpen, onClose }) => {
    const { id: logged_in_user_id }: any = useAppSelector(selectAuth);
    const { data: carts, isFetching: cartFetching } =
        useGetCartsQuery(logged_in_user_id);
    const [emptyCart] = useEmptyCartsMutation();
    const [deleteCart] = useDeleteCartsMutation();
    const [checkout] = useCheckoutMutation();
    const [updateCartItem] = useUpdateCartItemMutation();
    const { newToast } = customToast();
    const ref: any = useRef(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    let subTotal: number = 0;

    const removeCart = async () => {
        try {
            const result: any = await emptyCart(logged_in_user_id).unwrap();
            const { message } = result;
            newToast({ message: message, type: "success" });
            dispatch(cartApi.util.resetApiState());
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    const removeProd = async (id: number) => {
        try {
            const result: any = await deleteCart(id).unwrap();
            const { message } = result;
            newToast({ message: message, type: "success" });
            dispatch(cartApi.util.resetApiState());
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    const handleCheckout = async () => {
        try {
            const result: any = await checkout(carts).unwrap();
            const { url } = result.response;
            router.push(url);
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={ref}
            size={"md"}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Your Shopping Cart</DrawerHeader>

                <Button onClick={removeCart} mb={2}>
                    Empty Cart
                </Button>
                <Divider />
                <DrawerBody>
                    <Center>{cartFetching && <Spinner />}</Center>
                    <Grid gap={2}>
                        {/* make a component for this */}
                        {carts ? (
                            carts.map((item) => (
                                <Box
                                    as={Flex}
                                    key={item.id}
                                    p={2}
                                    // border={"1px"}
                                    justifyContent={"left"}
                                    fontWeight={"bold"}
                                    textTransform={"uppercase"}
                                    gap={6}>
                                    {item.user_id == logged_in_user_id && (
                                        <>
                                            <Box w={1 / 3}>
                                                <Img
                                                    src={"shop.jpg"}
                                                    w={"160px"}
                                                    minH={"auto"}
                                                    objectFit={"cover"}
                                                    objectPosition={"center"}
                                                    alt={"placeholder image"}
                                                />
                                                <NumberInput
                                                    w={"auto"}
                                                    size="sm"
                                                    defaultValue={item.quantity}
                                                    min={1}>
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper
                                                            bg="green.200"
                                                            _active={{
                                                                bg: "green.300",
                                                            }}
                                                            children="+"
                                                            onClick={() =>
                                                                updateCartItem({
                                                                    id: item.id,
                                                                    quantity:
                                                                        item.quantity +
                                                                        1,
                                                                })
                                                            }
                                                        />
                                                        <NumberDecrementStepper
                                                            bg="pink.200"
                                                            _active={{
                                                                bg: "pink.300",
                                                            }}
                                                            children="-"
                                                            onClick={() =>
                                                                updateCartItem({
                                                                    id: item.id,
                                                                    quantity:
                                                                        item.quantity -
                                                                        1,
                                                                })
                                                            }
                                                        />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </Box>
                                            <Box
                                                w={"full"}
                                                as={Flex}
                                                flexDirection={"column"}
                                                justifyContent={"space-between"}
                                                alignItems={"start"}>
                                                <Text size={"lg"}>
                                                    {item.product?.product_name}
                                                </Text>
                                                <Text>
                                                    ${item.product?.price}
                                                </Text>
                                                <Tag display={"none"}>
                                                    {
                                                        (subTotal +=
                                                            item.product
                                                                ?.price *
                                                            item.quantity)
                                                    }
                                                </Tag>
                                                <InputGroup
                                                    size="sm"
                                                    width="auto"
                                                    variant="unstyled"
                                                    placeholder="Unstyled">
                                                    <InputLeftAddon children="total price: " />
                                                    <Text
                                                        ml={2}
                                                        fontSize={"lg"}
                                                        fontWeight={"black"}>
                                                        {" "}
                                                        $
                                                        {item.product?.price *
                                                            item.quantity}
                                                    </Text>
                                                </InputGroup>

                                                <Button
                                                    onClick={() =>
                                                        removeProd(item.id)
                                                    }
                                                    variant="outline"
                                                    colorScheme="facebook"
                                                    children="remove"
                                                    size={"xs"}
                                                    borderRadius={0}
                                                />
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Heading
                                children="Cart is empty"
                                textAlign={"center"}
                                fontStyle={"italic"}
                            />
                        )}
                    </Grid>
                </DrawerBody>
                <DrawerFooter
                    borderTopWidth="1px"
                    display={"flex"}
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                    gap={6}>
                    <Heading alignSelf={"flex-start"} size={"lg"}>
                        SUBTOTAL: ${subTotal}
                    </Heading>
                    <ButtonGroup alignSelf={"flex-end"}>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => handleCheckout()}>
                            Checkout
                        </Button>
                    </ButtonGroup>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default DrawerComponent;
