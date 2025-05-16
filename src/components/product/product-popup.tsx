import React from "react";
import { useRouter } from "next/router";
import { useUI } from "@contexts/ui.context";
import Button from "@components/ui/button";
import { ProductAttributes } from "@components/product/product-attributes";
import { getVariations } from "@framework/utils/get-variations";
import { useTranslation } from "next-i18next";
import RatingDisplay from "@components/common/rating-display";

export default function ProductPopup() {
  const { t } = useTranslation("common");
  const {
    modalData: { data },
    closeModal,
  } = useUI();
  const router = useRouter();

  const variations = getVariations(data.variations);
  const { Name, ImagePath } = data;

  const placeholderImage = `http://admin.silsilaeiftekhari.in/${ImagePath}`;

  function navigateToBookPage() {
    closeModal();
    router.push(
      `/books/${Name.toLowerCase().replace(/\s+/g, "-")}/${data?.ID}`
    );
  }

  function handleAttribute(attribute: any) {
    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-430px max-h-430px lg:max-h-full overflow-hidden bg-gray-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              placeholderImage ??
              "/assets/placeholder/products/product-thumbnail.svg"
            }
            alt={Name}
            className="lg:object-cover lg:w-full lg:h-full"
          />
        </div>

        <div className="flex flex-col p-5 md:p-8 w-full">
          <div className="pb-5">
            <div
              className="mb-2 md:mb-2.5 block -mt-1.5"
              onClick={navigateToBookPage}
              role="button"
            >
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold hover:text-black">
                {Name}
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>author : </b>
              {data?.Author ?? "Not Available"}
            </div>
            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>translator : </b>
              {data?.Translator ?? "Not Available"}
            </div>

            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>rating : </b>
              <RatingDisplay rating={3.5} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>views : </b>
              {data?.Views ?? 0}
            </div>
            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>tags : </b>
              {data?.Tags ?? 0}
            </div>
            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>pages : </b>
              {data?.TotalPages ?? 0}
            </div>
            {/* <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>category : </b>
              {data?.Category ?? "Not Available"}
            </div> */}
            <div className="flex flex-col md:flex-row md:items-center lg:flex-row xl:flex-row 2xl:flex-row mb-0.5 items-start">
              <b style={{ paddingRight: 16 }}>language : </b>
              {data?.Language ?? "Not Available"}
            </div>

            {/* <div className="flex items-center mt-3">
              <div className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                {price}
              </div>
              {discount && (
                <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                  {basePrice}
                </del>
              )}
            </div>  */}
          </div>

          {Object.keys(variations).map((variation) => {
            return (
              <ProductAttributes
                key={`popup-attribute-key${variation}`}
                title={variation}
                attributes={variations[variation]}
                active={attributes[variation]}
                onClick={handleAttribute}
              />
            );
          })}

          <div className="pt-2 md:pt-4">
            <div className="flex items-center justify-between mb-4 gap-x-3 sm:gap-x-4">
              {/* <Counter
                quantity={quantity}
                onIncrement={() => setQuantity((prev) => prev + 1)}
                onDecrement={() =>
                  setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                }
                disableDecrement={quantity === 1}
              /> */}
              {/* <Button
                onClick={addToCart}
                variant="flat"
                className={`w-full h-11 md:h-12 px-1.5 ${
                  !isSelected && "bg-gray-400 hover:bg-gray-400"
                }`}
                disabled={!isSelected}
                loading={addToCartLoader}
              >
                {t("text-add-to-cart")}
              </Button> */}
            </div>

            {/* {viewCartBtn && (
              <button
                onClick={navigateToCartPage}
                className="w-full mb-4 h-11 md:h-12 rounded bg-gray-100 text-heading focus:outline-none border border-gray-300 transition-colors hover:bg-gray-50 focus:bg-gray-50"
              >
                {t("text-view-cart")}
              </button>
            )} */}

            <Button
              onClick={navigateToBookPage}
              variant="flat"
              className="w-full h-11 md:h-12"
            >
              {t("text-view-details")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
