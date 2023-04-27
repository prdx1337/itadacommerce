import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { customToast } from "@components/Toast";
import { PASS_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@constants/index";
import { selectAuth } from "@redux/features/authSlice";
import { useAppSelector } from "@redux/hooks";
import { useCreateUserMutation } from "@redux/services/authApi";
import { Users } from "@redux/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Signup: NextPage = () => {
    const [signupUser, { isSuccess: isSignupSuccess }] =
        useCreateUserMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Users>();
    const { newToast } = customToast();
    const { token } = useAppSelector(selectAuth);
    const router = useRouter();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const onSubmit = async (data: Users) => {
        try {
            const result: any = await signupUser(data).unwrap();
            const { message } = result;
            newToast({ message: message, type: "success" });
        } catch (error: any) {
            newToast({
                message: error.data.message,
                type: "error",
            });
        }
    };

    useEffect(() => {
        if (token) {
            router.push("/");
        }
        if (isSignupSuccess) {
            router.push("login");
        }
    }, [isSignupSuccess]);

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Let's get started ✌️</Heading>
                </Stack>
                <Box
                    minW={"25rem"}
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}>
                    <Stack
                        spacing={4}
                        as={"form"}
                        onSubmit={handleSubmit(onSubmit)}>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="username"
                                {...register("username", {
                                    required: true,
                                    minLength: 6,
                                    pattern: /^[a-zA-Z0-9]+$/,
                                })}
                                errorBorderColor="crimson"
                            />

                            {errors.username && (
                                <FormHelperText>
                                    {USER_ERROR_MESSAGES[errors.username.type]}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                {" "}
                                <Input
                                    type={show ? "text" : "password"}
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        onClick={handleClick}>
                                        {show ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="confirmPassword">
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                {" "}
                                <Input
                                    type={show ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: true,
                                        pattern: /[A-Za-z]{4}/,
                                        max: {
                                            value: 4,
                                            message: "error message",
                                        },
                                    })}
                                />
                            </InputGroup>
                            {errors.password && (
                                <FormHelperText>
                                    {PASS_ERROR_MESSAGES[errors.password.type]}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack spacing={10}>
                            <Button
                                alignItems={"center"}
                                type={"submit"}
                                rightIcon={<ArrowForwardIcon />}
                                colorScheme={"teal"}
                                variant={"outline"}>
                                Sign up
                            </Button>
                        </Stack>
                        <Button
                            alignSelf="start"
                            variant={"link"}
                            onClick={() => router.push("/login")}>
                            Already have an account?
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Signup;
