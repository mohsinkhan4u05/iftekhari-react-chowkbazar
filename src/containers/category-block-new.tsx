import Card from "@components/common/card";
import SectionHeader from "@components/common/section-header";
import Carousel from "@components/ui/carousel/carousel";
import CardLoader from "@components/ui/loaders/card-loader";
import CardRoundedLoader from "@components/ui/loaders/card-rounded-loader";
import { useCategoriesQuery } from "@framework/category/get-all-categories";
import { ROUTES } from "@utils/routes";
import Alert from "@components/ui/alert";
import { SwiperSlide } from "swiper/react";

interface CategoriesProps {
  sectionHeading: string;
  className?: string;
  type?: "rounded" | "circle";
  roundedItemCount?: number;
  roundedSpaceBetween?: number;
  imgSize?: "large";
  demoVariant?: "ancient";
  disableBorderRadius?: boolean;
}

const bgColors = [
  "bg-teal-700",
  "bg-purple-800",
  "bg-green-700",
  "bg-pink-800",
  "bg-blue-800",
  "bg-orange-600",
  "bg-yellow-800",
  "bg-indigo-800",
  "bg-red-800",
  "bg-rose-800",
  "bg-fuchsia-800",
];

const CategoryBlockNew: React.FC<CategoriesProps> = ({
  className = "mb-10 md:mb-11 lg:mb-12 xl:mb-14 lg:pb-1 xl:pb-0",
  sectionHeading,
  type = "circle",
  roundedItemCount,
  roundedSpaceBetween,
  imgSize,
  demoVariant,
  disableBorderRadius = false,
}) => {
  const breakpoints = {
    "1720": {
      slidesPerView: roundedItemCount === 5 ? 5 : 8,
      spaceBetween: roundedSpaceBetween || 28,
    },
    "1400": {
      slidesPerView: roundedItemCount === 5 ? 5 : 7,
      spaceBetween: roundedSpaceBetween || 28,
    },
    "1024": {
      slidesPerView: roundedItemCount === 5 ? 4 : 6,
      spaceBetween: roundedSpaceBetween || 20,
    },
    "768": {
      slidesPerView: roundedItemCount === 5 ? 3 : 5,
      spaceBetween: roundedSpaceBetween || 20,
    },
    "500": {
      slidesPerView: roundedItemCount === 5 ? 2 : 4,
      spaceBetween: roundedSpaceBetween || 12,
    },
    "0": {
      slidesPerView: roundedItemCount === 5 ? 2 : 3,
      spaceBetween: roundedSpaceBetween || 12,
    },
  };

  const breakpointsCircle = {
    "1720": {
      slidesPerView: 8,
      spaceBetween: 48,
    },
    "1400": {
      slidesPerView: 7,
      spaceBetween: 32,
    },
    "1025": {
      slidesPerView: 6,
      spaceBetween: 28,
    },
    "768": {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    "500": {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    "0": {
      slidesPerView: 3,
      spaceBetween: 12,
    },
  };

  const { data, isLoading, error } = useCategoriesQuery({
    limit: 10,
    demoVariant: demoVariant || undefined,
  });

  return (
    <div className={className}>
      <SectionHeader sectionHeading={sectionHeading} />
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <Carousel
          breakpoints={type === "rounded" ? breakpoints : breakpointsCircle}
          buttonGroupClassName="-mt-4 md:-mt-5 xl:-mt-7"
          autoplay={{
            delay: 3000,
          }}
        >
          {isLoading && !data
            ? Array.from({ length: roundedItemCount || 10 }).map((_, idx) => {
                if (type === "rounded") {
                  return (
                    <SwiperSlide key={`card-rounded-${idx}`}>
                      <CardRoundedLoader uniqueKey={`card-rounded-${idx}`} />
                    </SwiperSlide>
                  );
                }
                return (
                  <SwiperSlide key={`card-circle-${idx}`}>
                    <CardLoader uniqueKey={`card-circle-${idx}`} />
                  </SwiperSlide>
                );
              })
            : data?.categories?.data?.map((category, index) => (
                <SwiperSlide key={`category--key-${category.ID}`}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-pink-400 flex items-center justify-center text-white font-bold text-sm md:text-lg ${
                        bgColors[index % bgColors.length]
                      }`}
                    >
                      {category.Name}
                    </div>
                    <span className="mt-2 text-sm font-medium">
                      {category.Name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
        </Carousel>
      )}
    </div>
  );
};

export default CategoryBlockNew;
