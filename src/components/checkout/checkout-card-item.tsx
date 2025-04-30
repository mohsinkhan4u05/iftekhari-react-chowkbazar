import { Item } from "@contexts/cart/cart.utils";
import { generateCartItemName } from "@utils/generate-cart-item-name";
import usePrice from "@framework/product/use-price";
import Image from "next/image";

export const CheckoutItem: React.FC<{ item: Item }> = ({ item }) => {
  const { price } = usePrice({
    amount: item.itemTotal,
    currencyCode: "USD",
  });
  return (
    <div className="flex py-4 items-center lg:px-3 border-b border-gray-300">
      <div className="relative flex shrink-0 border rounded-md border-gray-300 w-16 h-16">
        <Image
          src={item.image ?? "/assets/placeholder/order-product.svg"}
          alt="currency"
          className="object-cover"
          fill
        />
      </div>
      <h6 className="text-sm ltr:pl-3 rtl:pr-3 font-regular text-heading">
        {generateCartItemName(item.name, item.attributes)}
      </h6>
      <div className="flex ltr:ml-auto rtl:mr-auto text-heading text-sm ltr:pl-2 rtl:pr-2 flex-shrink-0">
        {price}
      </div>
    </div>
  );
};
