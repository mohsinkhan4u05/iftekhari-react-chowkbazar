// components/common/PinchZoomWrapper.tsx
import { useEffect, useRef } from "react";
import PinchZoom from "pinch-zoom-js";

export default function PinchZoomWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (zoomRef.current) {
      const pz = new PinchZoom(zoomRef.current, { draggableUnzoomed: false });

      return () => {
        pz.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={zoomRef}
      className="pinch-zoom-wrapper w-full h-full overflow-hidden touch-none"
    >
      {children}
    </div>
  );
}
