import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "@components/Layout";
import { persistor, store } from "@redux/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
