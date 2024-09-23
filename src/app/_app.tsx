import { CartProvider } from "../components/CartContext"; // ตรวจสอบเส้นทาง
import { ThemeProvider } from "./components/ThemeProvider";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </CartProvider>
  );
}

export default MyApp;
