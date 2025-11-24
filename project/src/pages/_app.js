import "@/styles/globals.css";

const getLayoutDefault = (page) => page;

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || getLayoutDefault;

  return getLayout(
    <Component {...pageProps} />
  );
}
