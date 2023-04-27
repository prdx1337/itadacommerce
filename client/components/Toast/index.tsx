import { useToast } from "@chakra-ui/react";

export const customToast = () => {
    const toast = useToast();
    const newToast = (newRes: any) => {
        toast({
            description: newRes.message,
            status: newRes.type,
            position: "top-right",
            duration: 2000,
        });
    };
    return { newToast };
};
