import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";

export const DeleteDialog = ({
    isDelete,
    cancelRef,
    product_name,
    id,
    onDelete,
    name,
}: any) => {
    return (
        <AlertDialog
            isOpen={isDelete.isOpen}
            leastDestructiveRef={cancelRef}
            onClose={isDelete.onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader
                        fontSize="lg"
                        fontWeight="bold"
                        textTransform={"uppercase"}>
                        Delete {product_name && product_name}
                        {name && name} ?
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={isDelete.onClose}>Cancel</Button>
                        <Button
                            type="submit"
                            colorScheme="red"
                            onClick={() => onDelete(id)}
                            ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
