import ProductCard from '@components/product/product-card';
import { useTopSellerProductsQuery } from '@framework/product/get-all-top-seller-products';
import ProductListFeedLoader from '@components/ui/loaders/product-list-feed-loader';
import SectionHeader from '@components/common/section-header';
import Alert from '@components/ui/alert';

interface Props {
  sectionHeading: string;
  className?: string;
  carouselBreakpoint?: {} | any;
}

const ProductsTopBlock: React.FC<Props> = ({ sectionHeading, className = 'mb-12 md:mb-14 xl:mb-16' }) => {
  const { data, isLoading, error } = useTopSellerProductsQuery({
    limit: 6,
  });

  return (
    <div className={`${className}`}>
      <SectionHeader sectionHeading={sectionHeading} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 xl:gap-7 xl:-mt-1.5 2xl:mt-0">
        {error ? (
          <div className="col-span-full">
            <Alert message={error?.message} />
          </div>
        ) : isLoading ? (
          <ProductListFeedLoader limit={4} />
        ) : (
          data?.map((product) => (
            <ProductCard
              key={`product--key-${product.id}`}
              product={product}
              imgWidth={265}
              imgHeight={265}
              imageContentClassName="flex-shrink-0 w-32 sm:w-44 md:w-40 lg:w-52 2xl:w-56 3xl:w-64"
              contactClassName="ltr:pl-3.5 rtl:pr-3.5 ltr:sm:pl-5 rtl:sm:pr-5 ltr:md:pl-4 rtl:md:pr-4 ltr:xl:pl-5 rtl:xl:pr-5  ltr:2xl:pl-6 rtl:2xl:pr-6 ltr:3xl:pl-10 rtl:3xl:pr-10"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsTopBlock;
