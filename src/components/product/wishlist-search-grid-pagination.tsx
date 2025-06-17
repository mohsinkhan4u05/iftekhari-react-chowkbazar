import { useState, useEffect } from "react";
import BookCard from "@components/product/book-card";
import type { FC } from "react";
import { signIn, useSession } from "next-auth/react";
import { ImGoogle2 } from "react-icons/im";
import Button from "@components/ui/button";
import axios from "axios";
import { useLoginMutation } from "@framework/auth/use-login";
import dynamic from "next/dynamic";
const LottieLoader = dynamic(() => import("../common/loader/lottie-loader"), {
  ssr: false,
});

interface ProductGridProps {
  className?: string;
}

export const WishListSearchGridPagination: FC<ProductGridProps> = ({
  className = "",
}) => {
  const [wishlist, setWishlist]: any = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const { mutate: login, isPending } = useLoginMutation();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user/bookmarks/list");
      setWishlist(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false); // 👈 Hide loader
    }
  };

  useEffect(() => {
    if (session) {
      fetchWishlist();
    }
  }, [session]);

  return (
    <>
      {session && loading && (
        <div className="flex items-center justify-center h-64">
          <LottieLoader /> {/* 👈 Use your loader component here */}
        </div>
      )}
      {!session && (
        <div className="w-full px-5 py-5 mx-auto overflow-hidden bg-white border border-gray-300 rounded-lg sm:w-96 md:w-450px sm:px-8">
          <div className="text-center mb-6 pt-2.5">
            <p className="mt-2 mb-8 text-sm md:text-base text-body sm:mb-10">
              Please login to view your wishlist.
            </p>
          </div>

          <Button
            loading={isPending}
            disabled={isPending}
            className="h-11 md:h-12 w-full mt-2.5 bg-google hover:bg-googleHover"
            //onClick={handelSocialLogin}
            onClick={() => signIn("google")}
          >
            <ImGoogle2 className="text-sm sm:text-base ltr:mr-1.5 rtl:ml-1.5" />
            Login with Google
          </Button>
        </div>
      )}
      {session && wishlist.length === 0 && !loading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">
            Your wishlist is empty. Start adding books to your wishlist!
          </p>
        </div>
      )}
      {session && wishlist.length > 0 && (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 ... ${className}`}
        >
          {wishlist?.map((book) => (
            <BookCard key={book.ID} product={book} variant="grid" />
          ))}
        </div>
      )}
    </>
  );
};
