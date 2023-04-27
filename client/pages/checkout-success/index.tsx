import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Heading,
} from "@chakra-ui/react";
import { NextPage } from "next";

const Checkout: NextPage = () => {
    return (
        <Alert
            boxSize={"2xl"}
            mx={"auto"}
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px">
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
                Checkout Success!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
                Thank you. The item will be delivered to you soon.
            </AlertDescription>
        </Alert>
    );
};
export default Checkout;
