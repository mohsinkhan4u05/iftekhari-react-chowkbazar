import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Filled and outline hearts
import { toast } from "react-toastify";

const BookmarkButton = ({ bookId }: { bookId: number }) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Optionally fetch initial state from DB
  useEffect(() => {
    const checkBookmark = async () => {
      if (session) {
        const res = await axios.get(
          `/api/user/bookmarks/check?bookId=${bookId}`
        );
        setIsBookmarked(res.data?.bookmarked);
      }
    };
    checkBookmark();
  }, [session, bookId]);

  const toggleBookmark = async () => {
    if (!session) {
      toast.info("Please sign in to bookmark this book.");
      return signIn("google");
    }
    try {
      const response = await axios.post("/api/user/bookmarks/toggle", {
        bookId,
      });

      const bookmarked = response.data.bookmarked;
      setIsBookmarked(bookmarked);

      toast(
        bookmarked
          ? "Added to the wishlist !!!"
          : "Removed from the wishlist !!!",
        {
          //    progressClassName: "fancy-success-bar",
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Bookmark toggle failed.");
    }
  };

  //if (!session) return null;

  return (
    <button
      onClick={toggleBookmark}
      title={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
      className="text-red-500 text-xl hover:scale-110 transition-transform duration-150"
    >
      {isBookmarked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default BookmarkButton;
