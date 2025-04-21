import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://nextra.site"),
  title: {
    template: "%s - NestJS Turbo",
  },
  description: "NestJS Turbo: The best way to build a NestJS application",
  applicationName: "NestJS Turbo",
  generator: "Next.js",
  appleWebApp: {
    title: "NestJS Turbo",
  },
  other: {
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "msapplication-TileColor": "#fff",
  },
  twitter: {
    site: "https://vndevteam.github.io/nestjs-turbo",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbar = (
    <Navbar
      logo={
        <div>
          <b>NestJS Turbo</b>{" "}
          <span style={{ opacity: "30%" }}>
            The best way to build a NestJS application
          </span>
        </div>
      }
      projectLink="https://github.com/vndevteam/nestjs-turbo"
    />
  );
  const pageMap = await getPageMap();
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          navbar={navbar}
          footer={
            <Footer className="py-8">
              <div className="mx-auto px-4 sm:px-6">
                <div className="text-center">
                  <p>Built with ❤️ {new Date().getFullYear()} by VNDevTeam</p>
                </div>
              </div>
            </Footer>
          }
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/vndevteam/nestjs-turbo/tree/main/apps/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
