import {
  Button,
  Checkbox,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  PRODUCT_NAME_MESSAGES,
  PRODUCT_PRICE_MESSAGES,
} from "@constants/index";
import { useGetActiveShopsQuery } from "@redux/services/shopApi";
import { Products } from "@redux/types";
import { useForm } from "react-hook-form";

interface IProduct {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Products) => void;
}

const AddProductModal: React.FC<IProduct> = ({ isOpen, onClose, onSubmit }) => {
  const { data: shops } = useGetActiveShopsQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Products>();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3}>
            <Select
              placeholder="Select a Shop"
              {...register("shop_id", { required: true })}>
              {shops?.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Product Name"
              {...register("product_name", {
                required: true,
                minLength: 4,
                pattern: /^[^\s]+(?:$|.*[^\s]+$)/,
              })}
              errorBorderColor="crimson"
            />
            {errors.product_name && (
              <Text>{PRODUCT_NAME_MESSAGES[errors.product_name.type]}</Text>
            )}
            <InputGroup>
              <InputLeftAddon children="₱" />
              <Input
                placeholder="Price"
                {...register("price", { required: true, minLength: 3 })}
                type="number"
              />
            </InputGroup>
            {errors.price && (
              <Text>{PRODUCT_PRICE_MESSAGES[errors.price.type]}</Text>
            )}
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
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
