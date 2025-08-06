import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ManagedUIContext } from "@contexts/ui.context";
import ManagedModal from "@components/common/modal/managed-modal";
import ManagedDrawer from "@components/common/drawer/managed-drawer";
import { useEffect, useRef } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
// import { ReactQueryDevtools } from "@tanstack/react-query/devtools";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "@components/common/default-seo";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "react-hot-toast";

// Load Open Sans and satisfy typeface font
import "@fontsource/open-sans";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/satisfy";

// base css file
import "@styles/scrollbar.css";
import "@styles/swiper-carousel.css";
import "@styles/custom-plugins.css";
import "@styles/tailwind.css";
import "@styles/rc-drawer.css";
import "@styles/editor.css";
import { getDirection } from "@utils/get-direction";
import { BookCountProvider } from "@contexts/book/book-count.context";
import { SessionProvider } from "next-auth/react";
import RouteLoader from "../components/common/loader/route-loader";
import { MusicPlayerProvider } from "@contexts/music-player.context";
import { PlaylistProvider } from "@contexts/playlist.context";
import MusicPlayer from "@components/music-player/music-player";
import ClientOnly from "@components/common/client-only";

function handleExitComplete() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0 });
  }
}

function Noop({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

const CustomApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const router = useRouter();
  const dir = getDirection(router.locale);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  const Layout = (Component as any).Layout || Noop;

  return (
    <SessionProvider session={session}>
      <div
        className="bg-white text-black min-h-screen"
        style={{ colorScheme: "light" }}
      >
        <RouteLoader />
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          <QueryClientProvider client={queryClientRef.current}>
            {/* @ts-ignore */}
            <HydrationBoundary state={pageProps.dehydratedState}>
              {/* @ts-ignore */}
              <ManagedUIContext>
                <Layout pageProps={pageProps}>
                  <DefaultSeo />
                  <BookCountProvider>
                    <PlaylistProvider>
                      <MusicPlayerProvider>
                        <Component {...pageProps} key={router.route} />
                        <ClientOnly>
                          <MusicPlayer />
                        </ClientOnly>
                      </MusicPlayerProvider>
                    </PlaylistProvider>
                  </BookCountProvider>
                  <ToastContainer toastClassName="!text-white" />
                  <Toaster position="top-right" reverseOrder={false} />
                </Layout>
                <ManagedModal />
                <ManagedDrawer />
              </ManagedUIContext>
            </HydrationBoundary>
            {/* <ReactQueryDevtools /> */}
          </QueryClientProvider>
        </AnimatePresence>
      </div>
    </SessionProvider>
  );
};

export default appWithTranslation(CustomApp);
