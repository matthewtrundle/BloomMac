import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical font */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for above-the-fold content */
              :root {
                --bloom: #40464A;
                --bloom-blush: #FFE4EA;
                --bloom-darkGrey: #4A4A4A;
                --bloom-accent: #FF5B9F;
                --bloompink: #C63780;
              }
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                background-color: white;
                color: var(--bloom);
                min-height: 100vh;
              }
              
              /* Hero section critical styles */
              .hero-section {
                position: relative;
                height: 75vh;
              }
              
              /* Prevent layout shift for header */
              header {
                height: 80px;
              }
              
              /* Critical button styles */
              .btn-primary {
                background-color: var(--bloompink);
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: bold;
                text-decoration: none;
                display: inline-block;
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}