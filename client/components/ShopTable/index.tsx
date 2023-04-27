import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Checkbox,
    Code,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Img,
    Input,
    Popover,
    PopoverArrow,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Select,
    Stack,
    Switch,
    Tag,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { DeleteDialog } from "@components/AlertDialog";
import { customToast } from "@components/Toast";
import {
    SHOP_ADDRESS_ERROR_MESSAGES,
    SHOP_ERROR_MESSAGES,
} from "@constants/index";
import "@public/shop.jpg";
import { useAppDispatch } from "@redux/hooks";
import { cartApi } from "@redux/services/cartApi";
import {
    useActivateShopsMutation,
    useDeleteShopsMutation,
    useUpdateShopsMutation,
} from "@redux/services/shopApi";
import { Shops } from "@redux/types";
import React from "react";
import FocusLock from "react-focus-lock";
import { SubmitHandler, useForm } from "react-hook-form";

export const ShopTable: React.FC<any> = ({
    id,
    name,
    address,
    business_type,
    is_active,
    products,
}) => {
    const [deleteShop] = useDeleteShopsMutation();
    const [updateShop] = useUpdateShopsMutation();
    const [activateShop] = useActivateShopsMutation();

    const { newToast } = customToast();
    const isDelete = useDisclosure();
    const isUpdate = useDisclosure();
    const updateForm = useForm<Shops>();

    const {
        formState: { errors },
    } = updateForm;
    const cancelRef = React.useRef<any>();
    const firstFieldRef = React.useRef(null);
    const [active, setActive] = React.useState(is_active);
    const dispatch = useAppDispatch();

    const onDelete: SubmitHandler<Shops> = async (id) => {
        try {
            const result: any = await deleteShop(id).unwrap();
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

    const onUpdate: SubmitHandler<Shops> = async (data) => {
        try {
            const result: any = await updateShop(data).unwrap();
            const { message } = result;
            isUpdate.onClose();
            newToast({ message: message, type: "success" });
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    const handleToggle = async (event: any) => {
        setActive(event.target.checked);
        await activateShop({ id: id, is_active: event.target.checked });
        dispatch(cartApi.util.resetApiState());
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
                    <Flex py={2} justifyContent={"space-between"}>
                        <Tag children={business_type} fontSize={10} />
                        <Tag
                            children={
                                is_active == true ? "available" : "unavailable"
                            }
                            fontSize={10}
                        />
                    </Flex>
                    <Heading
                        color={useColorModeValue("gray.700", "white")}
                        fontSize={"lg"}
                        fontWeight={"black"}
                        textTransform={"uppercase"}
                        noOfLines={1}
                        children={name}
                    />
                    <Text fontSize={"sm"} color={"gray.400"} noOfLines={1}>
                        {address}
                    </Text>

                    <Divider />
                    <Center gap={2}>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel
                                htmlFor="shop-status"
                                mb="0"
                                fontSize={"xs"}>
                                Shop status?
                            </FormLabel>
                            <Switch
                                id="shop-status"
                                onChange={handleToggle}
                                isChecked={active}
                                size={"sm"}
                            />
                        </FormControl>
                        <Popover
                            isOpen={isUpdate.isOpen}
                            initialFocusRef={firstFieldRef}
                            onOpen={isUpdate.onOpen}
                            onClose={isUpdate.onClose}
                            placement="right"
                            closeOnBlur={true}>
                            <PopoverTrigger>
                                <EditIcon
                                    cursor={"pointer"}
                                    textColor={"green.400"}
                                />
                            </PopoverTrigger>
                            <PopoverContent p={5}>
                                <FocusLock returnFocus persistentFocus={false}>
                                    <PopoverArrow />
                                    <PopoverCloseButton />

                                    <Stack spacing={4}>
                                        <FormControl
                                            as={"form"}
                                            onSubmit={updateForm.handleSubmit(
                                                onUpdate
                                            )}>
                                            <FormLabel>
                                                Update Shop Details
                                            </FormLabel>

                                            <VStack spacing={3}>
                                                <Input
                                                    type="hidden"
                                                    value={id}
                                                    {...updateForm.register(
                                                        "id",
                                                        {
                                                            required: true,
                                                        }
                                                    )}
                                                />
                                                <Input
                                                    placeholder={name}
                                                    {...updateForm.register(
                                                        "name",
                                                        {
                                                            required: true,
                                                            minLength: 6,
                                                            pattern:
                                                                /^[a-zA-Z0-9\s]+$/,
                                                        }
                                                    )}
                                                />
                                                {errors.name && (
                                                    <Code>
                                                        {
                                                            SHOP_ERROR_MESSAGES[
                                                                errors.name.type
                                                            ]
                                                        }
                                                    </Code>
                                                )}
                                                <Input
                                                    placeholder={address}
                                                    {...updateForm.register(
                                                        "address",
                                                        {
                                                            required: true,
                                                            minLength: 10,
                                                            pattern:
                                                                /^[^\s]+(?:$|.*[^\s]+$)/,
                                                        }
                                                    )}
                                                />
                                                {errors.address && (
                                                    <Code>
                                                        {
                                                            SHOP_ADDRESS_ERROR_MESSAGES[
                                                                errors.address
                                                                    .type
                                                            ]
                                                        }
                                                    </Code>
                                                )}
                                                <Select
                                                    placeholder={business_type}
                                                    {...updateForm.register(
                                                        "business_type",
                                                        {
                                                            required: true,
                                                        }
                                                    )}>
                                                    <option value="food">
                                                        food
                                                    </option>
                                                    <option value="fashion">
                                                        fashion
                                                    </option>
                                                    <option value="electronics">
                                                        electronics
                                                    </option>
                                                </Select>
                                                <Checkbox
                                                    {...updateForm.register(
                                                        "is_active"
                                                    )}
                                                    isChecked={true}
                                                    visibility={"hidden"}
                                                />
                                            </VStack>

                                            <ButtonGroup gap={2}>
                                                <Button
                                                    bg={"green.200"}
                                                    type="submit">
                                                    Submit
                                                </Button>

                                                <Button
                                                    onClick={isUpdate.onClose}>
                                                    Close
                                                </Button>
                                            </ButtonGroup>
                                        </FormControl>
                                    </Stack>
                                </FocusLock>
                            </PopoverContent>
                        </Popover>
                        <Center height="20px">
                            <Divider orientation="vertical" />
                        </Center>
                        <DeleteIcon
                            onClick={isDelete.onOpen}
                            cursor={"pointer"}
                            textColor={"red.400"}
                        />
                    </Center>
                </Stack>
            </Box>

            <DeleteDialog
                onDelete={onDelete}
                isDelete={isDelete}
                name={name}
                id={id}
                cancelRef={cancelRef}
            />
        </>
    );
};
