import React, { useState } from "react";
import { useRouter } from "next/router";
import { useUI } from "@contexts/ui.context";
import Button from "@components/ui/button";
import { ProductAttributes } from "@components/product/product-attributes";
import { getVariations } from "@framework/utils/get-variations";
import { useTranslation } from "next-i18next";
import RatingDisplay from "@components/common/rating-display";
import Lottie from "lottie-react";
import loaderAnimation from "/public/loader.json";
export default function ProductPopup() {
  const { t } = useTranslation("common");
  const {
    modalData: { data },
    closeModal,
  } = useUI();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const variations = getVariations(data.variations);
  const { Name, ImagePath } = data;

  const placeholderImage = `http://admin.silsilaeiftekhari.in/${ImagePath}`;

  // function navigateToBookPage() {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //   closeModal();
  //     router.push(
  //       `/books/${Name.toLowerCase().replace(/\s+/g, "-")}/${data?.ID}`
  //     );
  //   }, 2000); // Optional delay for visual transition
  // }

  async function navigateToBookPage() {
    try {
      // Trigger view count increment
      await fetch("/api/books/increment-views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data?.ID }),
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
      // Proceed with navigation even if update fails
    }

    setIsLoading(true);
    setTimeout(() => {
      closeModal();
      router.push(
        `/books/${Name.toLowerCase().replace(/\s+/g, "-")}/${data?.ID}`
      );
    }, 2000); // Optional delay for visual transition
  }

  const Detail = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex gap-x-2">
      <span className="font-semibold">{label}:</span>
      <span>{value || "Not Available"}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg w-full max-w-[960px] mx-auto overflow-hidden shadow-lg">
      <div className="flex flex-col lg:flex-row">
        {/* Left - Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100">
          <img
            src={
              placeholderImage ??
              "/assets/placeholder/products/product-thumbnail.svg"
            }
            alt={Name}
            className="object-contain max-h-[600px] w-auto"
          />
        </div>

        {/* Right - Info */}
        <div className="w-full lg:w-1/2 p-6 md:p-8 space-y-5">
          <h2
            onClick={navigateToBookPage}
            role="button"
            className="text-2xl font-bold text-gray-800 hover:text-black cursor-pointer"
          >
            {Name}
          </h2>

          <div className="space-y-2 text-sm text-gray-700">
            {/* Author & Translator in separate lines */}
            <Detail label="Author" value={data?.Author} />
            <Detail label="Translator" value={data?.Translator} />

            {/* Remaining details in a responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <Detail label="Rating" value={<RatingDisplay rating={3.5} />} />
              <Detail label="Views" value={data?.Views ?? 0} />
              <Detail label="Pages" value={data?.TotalPages ?? 0} />
              <Detail label="Category" value={data?.CategoryName} />
              <Detail label="Language" value={data?.Language} />
            </div>
          </div>

          {/* Tags */}
          {data?.Tags && (
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                Tags:
              </div>
              <div className="flex flex-wrap gap-2">
                {data.Tags.split(",").map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-gray-200 text-xs text-gray-800"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variations (if needed) */}
          {Object.keys(variations).length > 0 && (
            <div className="pt-2">
              {Object.keys(variations).map((variation) => (
                <ProductAttributes
                  key={`popup-attribute-key${variation}`}
                  title={variation}
                  attributes={variations[variation]}
                  active={data[variation]}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          {isLoading ? (
            <div className="w-full h-16 flex items-center justify-center mt-4">
              <Lottie
                animationData={loaderAnimation}
                loop
                autoplay
                className="w-20 h-20"
              />
            </div>
          ) : (
            <Button
              onClick={navigateToBookPage}
              variant="flat"
              className="w-full h-11 mt-4"
            >
              {t("text-read-book")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for Label-Value pairs
const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex gap-x-2">
    <span className="font-semibold">{label}:</span>
    <span>{value || "Not Available"}</span>
  </div>
);
