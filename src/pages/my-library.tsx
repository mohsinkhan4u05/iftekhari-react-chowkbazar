import { useState } from "react";
import MyWishlist from "./user/my-wishlist";
import MyReadings from "./user/my-readings";
import Layout from "@components/layout/layout";
import { signIn, useSession } from "next-auth/react";
import { ImGoogle2 } from "react-icons/im";
import Button from "@components/ui/button";

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "bookmarks">(
    "wishlist"
  );

  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px- py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">My Library</h1>

      {!session && (
        <div className="w-full px-5 py-5 mx-auto overflow-hidden bg-white border border-gray-300 rounded-lg sm:w-96 md:w-450px sm:px-8">
          <div className="text-center mb-6 pt-2.5">
            <p className="mt-2 mb-8 text-sm md:text-base text-body sm:mb-10">
              Please login to view your wishlist.
            </p>
          </div>

          <Button
            className="h-11 md:h-12 w-full mt-2.5 bg-google hover:bg-googleHover"
            //onClick={handelSocialLogin}
            onClick={() => signIn("google")}
          >
            <ImGoogle2 className="text-sm sm:text-base ltr:mr-1.5 rtl:ml-1.5" />
            Login with Google
          </Button>
        </div>
      )}

      {session && (
        <>
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === "wishlist"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              ❤️ My Wishlist
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === "bookmarks"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              📌 My Readings
            </button>
          </div>
          <div className="max-w-6xl mx-auto">
            {activeTab === "wishlist" ? <MyWishlist /> : <MyReadings />}
          </div>
        </>
      )}
    </div>
  );
}

MyLibraryPage.Layout = Layout;
