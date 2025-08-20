import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MusicLayout from "@components/music-redesign/music-layout";
import MusicHomePage from "@components/music-redesign/home-page";

const MusicRedesignPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MusicLayout>
        <MusicHomePage />
      </MusicLayout>
    </div>
  );
};

MusicRedesignPage.Layout = MusicLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default MusicRedesignPage;
