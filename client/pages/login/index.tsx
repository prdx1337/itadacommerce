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
    Stack,
    useColorModeValue,
} from "@chakra-ui/react";
import { customToast } from "@components/Toast";
import { PASS_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@constants/index";
import { selectAuth } from "@redux/features/authSlice";
import { useAppSelector } from "@redux/hooks";
import { useLoginUserMutation } from "@redux/services/authApi";
import { Users } from "@redux/types";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Login: NextPage = () => {
    const [loginUser, { isSuccess: isLoginSuccess }] = useLoginUserMutation();
    const { token } = useAppSelector(selectAuth);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Users>();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const { newToast } = customToast();
    const onSubmit = async (data: Users) => {
        try {
            const result: any = await loginUser(data).unwrap();
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
        if (token || isLoginSuccess) {
            router.push("/");
        }
    }, [isLoginSuccess]);

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Sign in now! ✌️</Heading>
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
                                Sign in
                            </Button>
                        </Stack>
                        <Button
                            alignSelf="start"
                            variant={"link"}
                            onClick={() => router.push("/signup")}>
                            Don't have an account yet?
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Login;
