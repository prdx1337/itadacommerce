import { Box, Code, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Redirect: NextPage = () => {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);
    count === 0 && router.push("/login");
    return () => clearInterval(interval);
  }, [count]);

  return (
    <Box>
      <Heading>
        <Code>Redirecting you in {count}</Code>
      </Heading>
    </Box>
  );
};
export default Redirect;
