import {
    Button,
    Checkbox,
    Code,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    VStack,
} from "@chakra-ui/react";
import {
    SHOP_ADDRESS_ERROR_MESSAGES,
    SHOP_ERROR_MESSAGES,
} from "@constants/index";
import { Shops } from "@redux/types";
import { useForm } from "react-hook-form";

interface IShop {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Shops) => void;
}

const AddShopModal: React.FC<IShop> = ({ isOpen, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Shops>();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Shop Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={3}>
                        <Input
                            placeholder="Name"
                            {...register("name", {
                                required: true,
                                minLength: 6,
                                pattern: /^[a-zA-Z0-9\s]+$/,
                            })}
                            errorBorderColor="crimson"
                        />
                        {errors.name && (
                            <Code>{SHOP_ERROR_MESSAGES[errors.name.type]}</Code>
                        )}
                        <Input
                            placeholder="Address"
                            {...register("address", {
                                required: true,
                                minLength: 10,
                                pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
                            })}
                            errorBorderColor="crimson"
                        />
                        {errors.address && (
                            <Code>
                                {
                                    SHOP_ADDRESS_ERROR_MESSAGES[
                                        errors.address.type
                                    ]
                                }
                            </Code>
                        )}
                        <Select
                            placeholder="Select Business Type"
                            {...register("business_type", {
                                required: true,
                            })}>
                            <option value="food">food</option>
                            <option value="fashion">fashion</option>
                            <option value="electronics">electronics</option>
                        </Select>
                        <Checkbox
                            {...register("is_active")}
                            isChecked={true}
                            visibility={"hidden"}
                        />
                    </VStack>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button colorScheme="teal" type="submit">
                        Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddShopModal;
