import { useEffect, RefObject } from 'react'

type Event = MouseEvent | TouchEvent

export default function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
) {
  useEffect(
    () => {
      if (ref?.current === null) return;

      const listener = (event: Event) => {
        const el = ref?.current
        if (!el || el.contains((event?.target as Node) || null)) {
          return
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    [ref, handler]
  );
}