import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import Head from "next/head";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import dynamic from "next/dynamic";
import Image from "next/image";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
});

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
        <img src="/assets//images/right-arrow.svg" alt="right-arrow" />
      </div>
    );
  };

  const Wrapper = styled.div`
    .slick-next {
      z-index: 1;
      right: 30px;
      width: 50px;
      height: 50px;
      &:before {
        display: none;
      }
    }

    .slick-prev {
      z-index: 1;
      left: 15px;
      width: 50px;
      height: 50px;
      &:before {
        display: none;
      }
    }

    .slick-prev:hover,
    .slick-prev:focus,
    .slick-next:hover,
    .slick-next:focus {
      color: tomato;
      outline: none;
      background: transparent;
      background: lightgray;
    }
  `;

  const settings: any = {
    dots: false,
    infinite: infiniteState,

    slidesToShow: 2,
    slidesToScroll: 1,
    lazyLoad: true,
    initialSlide: 0,
    className: "center",
    focusOnSelect: true,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: infiniteState,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: infiniteState,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: infiniteState,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: infiniteState,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: infiniteState,
          initialSlide: 1,
        },
      },
    ],
  };

  const fetchNewArrivalAncientBooks = async () => {
    const { data } = await http.get(`${API_ENDPOINTS.BOOKS_INFO}/${id}`);
    if (data && data.Images?.length > 3) {
      setInfinite(true);
    } else {
      setInfinite(false);
    }
    setBook(data);
  };

  useEffect(() => {
    if (id) {
      fetchNewArrivalAncientBooks();
    }
  }, [id]);

  return (
    <>
      <Divider className="mb-0" />
      <Container>
        <div className="pt-8">
          <Breadcrumb />
        </div>
        <Head>
          <title>{book.name + " | E-BOOK"}</title>
          <meta
            name="description"
            content={"sufi book " + book.name + " by " + book.Author}
            key="desc"
          />
        </Head>
        <div>
          <Wrapper>
            {book && book.images?.length > 0 && (
              <Slider {...settings}>
                {book &&
                  book.images?.map((item: any) => (
                    <div key={item} className="w-full">
                      <TransformWrapper>
                        <TransformComponent
                          contentStyle={{ width: "100%" }}
                          wrapperStyle={{ width: "100%" }}
                        >
                          {/* <img
                            className="w-[80%] h-auto object-cover"
                            style={{ objectFit: "cover" }}
                            key={item}
                            alt={book.name + " Sufi Book"}
                            title={"Author " + book.author}
                            // src={item}
                            src={`/api/image-proxy?url=${item}`}
                          /> */}

                          <Image
                            src={`/api/image-proxy?url=${item}`}
                            className="w-[80%] h-auto object-cover"
                            style={{ objectFit: "cover" }}
                            key={item}
                            alt={book.name + " Sufi Book"}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                    </div>
                  ))}
              </Slider>
            )}
          </Wrapper>
        </div>
      </Container>
    </>
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
