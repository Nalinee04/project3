import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* เพิ่ม Longdo Map API key */}
        <script
          type="text/javascript"
          src={`https://api.longdo.com/map/?key=${process.env.NEXT_PUBLIC_LONGDO_API_KEY}`}
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
