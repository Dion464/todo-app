import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Todo App with authentication and task management" />
        <link rel="icon" href="/images.jpeg" />
      
        <meta name="theme-color" content="#2C3E50" /> 
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
