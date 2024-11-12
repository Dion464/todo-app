import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Todo App with authentication and task management" />
        <link rel="icon" href="/images.jpeg" />
        {/* Set the browser theme color to match your app's color scheme */}
        <meta name="theme-color" content="#2C3E50" /> {/* Adjust this color as per your theme */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
