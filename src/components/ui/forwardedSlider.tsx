import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Slider from "react-slick";

export type SliderRef = {
  slickGoTo: (index: number) => void;
  slickNext: () => void;
  slickPrev: () => void;
};

const ForwardedSlider = forwardRef<SliderRef, any>((props, ref) => {
  const internalRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    slickGoTo: (index: number) => internalRef.current?.slickGoTo(index),
    slickNext: () => internalRef.current?.slickNext(),
    slickPrev: () => internalRef.current?.slickPrev(),
  }));

  return <Slider ref={internalRef} {...props} />;
});

ForwardedSlider.displayName = "ForwardedSlider";

export default ForwardedSlider;
