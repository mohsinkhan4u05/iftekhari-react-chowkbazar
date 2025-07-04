import { useSession, signIn } from "next-auth/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useBookmark } from "@contexts/bookmark/bookmark.context";

interface OptimizedBookmarkButtonProps {
  bookId: number;
  className?: string;
}

const OptimizedBookmarkButton: React.FC<OptimizedBookmarkButtonProps> = ({ 
  bookId, 
  className = "text-red-500 text-xl hover:scale-110 transition-transform duration-150" 
}) => {
  const { data: session } = useSession();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const bookmarked = isBookmarked(bookId);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.info("Please sign in to bookmark this book.");
      return signIn("google");
    }

    try {
      const newBookmarkState = await toggleBookmark(bookId);
      
      toast(
        newBookmarkState
          ? "Added to the wishlist !!!"
          : "Removed from the wishlist !!!",
        {
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

  return (
    <button
      onClick={handleToggleBookmark}
      title={bookmarked ? "Remove from wishlist" : "Add to wishlist"}
      className={className}
    >
      {bookmarked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default OptimizedBookmarkButton;
