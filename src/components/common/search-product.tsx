import Link from "@components/ui/link";
import Image from "next/image";
import { ROUTES } from "@utils/routes";

type SearchProductProps = {
  item: any;
};

const SearchProduct: React.FC<SearchProductProps> = ({ item }) => {
  const placeholderImage = `http://admin.silsilaeiftekhari.in/${item?.ImagePath}`;
  return (
    <Link
      href={`${ROUTES.BOOK}/${item?.Name}/${item?.ID}`}
      className="flex items-center justify-start w-full h-auto group"
    >
      <div className="relative flex flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-200 rounded-md cursor-pointer ltr:mr-4 rtl:ml-4">
        <Image
          src={placeholderImage ?? "/assets/placeholder/search-product.svg"}
          width={96}
          height={96}
          loading="eager"
          alt={item?.Name || "Product Image"}
          className="object-cover bg-gray-200"
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <div className="text-sm font-semibold text-heading">{item?.Name}</div>
        <h3 className="mb-2 text-sm truncate text-heading">{item?.Author}</h3>
        {item?.Tags && (
          <div className="flex flex-wrap gap-2">
            {item.Tags.split(",").map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-200 text-xs text-gray-800"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchProduct;
