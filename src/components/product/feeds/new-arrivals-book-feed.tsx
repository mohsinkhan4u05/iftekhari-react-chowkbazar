import BooksBlock from "@containers/books-block";
import { useNewArrivalBooksQuery } from "@framework/product/get-all-new-arrival-books";

interface Props {
  hideProductDescription?: boolean;
  showCategory?: boolean;
  showRating?: boolean;
  demoVariant?: "ancient";
  disableBorderRadius?: boolean;
  className?: string;
  type?: string;
  limit?: number;
  sectionHeading?: string;
}

export default function NewArrivalsBookFeed({
  hideProductDescription = false,
  showCategory = false,
  showRating = false,
  demoVariant,
  disableBorderRadius = false,
  className = "mb-9 md:mb-10 xl:mb-12",
  type,
  limit,
  sectionHeading,
}: Props) {
  const { data, isLoading, error } = useNewArrivalBooksQuery({
    limit: limit,
    type: type,
    demoVariant,
  });

  return (
    <BooksBlock
      className={className}
      hideProductDescription={hideProductDescription}
      showCategory={showCategory}
      showRating={showRating}
      sectionHeading={sectionHeading}
      products={data}
      loading={isLoading}
      error={error?.message}
      uniqueKey="new-arrivals-books"
      demoVariant={demoVariant}
      disableBorderRadius={disableBorderRadius}
    />
  );
}
