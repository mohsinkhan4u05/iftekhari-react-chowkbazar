import React from "react";
import Lottie from "lottie-react";

// Place your Lottie JSON file in the public folder (e.g. /public/lottie/loader.json)
const animationData = require("../../../../public/loader.json");

export default function LottieLoader({ className }: { className?: string }) {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className || "w-20 h-20"}
    />
  );
}
