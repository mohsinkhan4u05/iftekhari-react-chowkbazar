import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: relative;

  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 48px;
    height: 48px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      filter: invert(1); /* make arrow white */
    }
  }

  .slick-prev {
    left: 16px;

    @media (max-width: 768px) {
      left: 8px;
    }
  }

  .slick-next {
    right: 16px;

    @media (max-width: 768px) {
      right: 8px;
    }
  }

  @media (max-width: 768px) {
    .slick-prev img,
    .slick-next img {
      display: none;
    }
  }
`;

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook]: any = useState([]);
  const [infiniteState, setInfinite] = useState(false);

  const PrevArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <img src="/assets/images/left-arrow.svg" alt="left-arrow" />
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <img src="/assets/images/right-arrow.svg" alt="right-arrow" />
      </div>
    );
  };

  const settings: any = {
    dots: false,
    infinite: infiniteState,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    initialSlide: 0,
    focusOnSelect: true,
    adaptiveHeight: true,
    swipe: true,
    touchMove: true,
    swipeToSlide: true,
    arrows: true, // make sure it's not false
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
  };

  const fetchBookInfo = async () => {
    try {
      const res = await fetch(`/api/books/info/${id}`);
      const data = await res.json();

      if (res.ok) {
        setInfinite(data?.Images?.length > 3);
        setBook(data);
      } else {
        console.error("Failed to fetch book info:", data.error);
      }
    } catch (error) {
      console.error("Error fetching book info:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookInfo();
    }
  }, [id]);

  return (
    <div className="w-screen h-screen overflow-hidden m-0 p-0">
      <Wrapper>
        {book && book.Images?.length > 0 && (
          <Slider {...settings}>
            {book.Images.map((item: any, index: number) => (
              <div
                key={index}
                className="w-screen h-screen flex justify-center items-center"
              >
                <TransformWrapper
                  pinch={{ disabled: true }}
                  doubleClick={{ disabled: true }}
                  wheel={{ disabled: true }}
                >
                  <TransformComponent
                    contentStyle={{ width: "100%" }}
                    wrapperStyle={{ width: "100%" }}
                  >
                    <div className="h-[80vh] md:h-[95vh] w-full">
                      <img
                        className="w-full h-full object-contain"
                        src={item}
                        alt={`Page ${index + 1}`}
                      />
                    </div>
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ))}
          </Slider>
        )}
      </Wrapper>
    </div>
  );
}

BookPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};
