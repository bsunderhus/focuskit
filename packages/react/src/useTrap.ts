import * as React from "react";
import { Trap } from "@focuskit/vanilla";

const defaultImperative = {
  enable: () => null,
  disable: () => null,
};

export function useTrap<TElement extends HTMLElement = HTMLElement>(
  id: string
) {
  const disposeRef = React.useRef<() => void>(() => null);
  const imperativeRef = React.useRef<{
    enable: () => void;
    disable: () => void;
  }>(defaultImperative);

  const elementRef = React.useCallback((el: HTMLElement | null) => {
    if (el) {
      const trap = new Trap(el, { id });
      disposeRef.current = () => trap.dispose();
      imperativeRef.current = {
        enable: () => trap.active = true,
        disable: () => trap.active = false,
      }
    } else {
      disposeRef.current();
      disposeRef.current = () => null;
      imperativeRef.current = defaultImperative;
    }
  }, [id]);

  return { elementRef, imperativeRef };
}
