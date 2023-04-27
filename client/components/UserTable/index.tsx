import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Badge,
  Button,
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
  Spinner,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useDeleteUsersMutation,
  useUpdateUsersMutation,
} from "@redux/services/userApi";
import { Users } from "@redux/types";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineUser } from "react-icons/ai";

export const UserTable: React.FC<any> = ({ id, username, password }) => {
  const [
    deleteUser,
    { isSuccess: isDeleteSuccess, isLoading: isDeleteLoading },
  ] = useDeleteUsersMutation();
  const [
    updateUser,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateUsersMutation();
  const isDelete = useDisclosure();
  const isUpdate = useDisclosure();
  const deleteForm = useForm<Users>();
  const updateForm = useForm<Users>();
  let toast = useToast();

  const onDelete: SubmitHandler<Users> = async () => {
    await deleteUser(id);
  };

  const onUpdate: SubmitHandler<Users> = async (data) => {
    await updateUser(data);
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      isUpdate.onClose();
      toast({
        position: "top",
        title: "User Updated.",
        description: "User updated successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }

    if (isDeleteSuccess) {
      isDelete.onClose();
      toast({
        position: "top",
        title: "User Deleted.",
        description: "User deleted successfully.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isUpdateSuccess, isDeleteSuccess]);

  return (
    <>
      <Tbody>
        <Tr>
          <Td>{id}</Td>
          <Td>
            <Avatar size={"xs"} mr={2} icon={<AiOutlineUser fontSize="1rem" />}>
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            {username}
          </Td>

          <Td>
            <EditIcon
              onClick={isUpdate.onOpen}
              w={5}
              h={5}
              cursor={"pointer"}
              textColor={"green.400"}
              mx={"2"}
            />
            |
            <DeleteIcon
              onClick={isDelete.onOpen}
              w={5}
              h={5}
              cursor={"pointer"}
              textColor={"red.400"}
              mx={"2"}
            />
            {/* update */}
            <Modal isOpen={isUpdate.isOpen} onClose={isUpdate.onClose}>
              <ModalOverlay />
              <ModalContent
                as={"form"}
                onSubmit={updateForm.handleSubmit(onUpdate)}>
                <ModalHeader>UPDATE USER</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={3}>
                    <Input
                      type="hidden"
                      value={id}
                      {...updateForm.register("id", { required: true })}
                    />
                    <Input
                      placeholder={username}
                      {...updateForm.register("username", {
                        required: true,
                        pattern: /[A-Za-z]{3}/,
                        max: {
                          value: 3,
                          message: "error message",
                        },
                      })}
                    />
                    <InputGroup>
                      <InputLeftAddon children={"@"} />
                      <Input
                        placeholder={password}
                        {...updateForm.register("password", {
                          required: true,
                          pattern: /[A-Za-z]{3}/,
                          max: {
                            value: 3,
                            message: "error message",
                          },
                        })}
                      />
                    </InputGroup>
                  </VStack>
                </ModalBody>
                <ModalFooter gap={2}>
                  {isUpdateLoading && <Spinner />}
                  <Button bg={"green.200"} type="submit">
                    Submit
                  </Button>

                  <Button onClick={isUpdate.onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {/* delete */}
            <Modal isOpen={isDelete.isOpen} onClose={isDelete.onClose}>
              <ModalOverlay />
              <ModalContent
                as={"form"}
                onSubmit={deleteForm.handleSubmit(onDelete)}>
                <ModalHeader>DELETE USER</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={3}>
                    <Text>
                      Delete <Badge colorScheme="red">"{username}"</Badge> in
                      the list?
                    </Text>
                  </VStack>
                </ModalBody>
                <ModalFooter gap={2}>
                  {isDeleteLoading && <Spinner />}
                  <Button bg={"orange.100"} type="submit">
                    Confirm
                  </Button>
                  <Button onClick={isDelete.onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Td>
        </Tr>
      </Tbody>
    </>
  );
};
