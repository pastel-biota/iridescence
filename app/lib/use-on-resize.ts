import { type RefObject, useCallback, useEffect, useState } from "react";

export function useOnResize(
  elementRef: Element | RefObject<Element | null>,
  fn: (entry: ResizeObserverEntry) => void,
) {
  useEffect(() => {
    const element =
      elementRef instanceof Element ? elementRef : elementRef.current;
    if (element == null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entries.length !== 1 || entry === undefined) {
        console.error(entries);
        throw new Error(
          "Thought only one entry would come, but it was actually different",
        );
      }

      fn(entry);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, fn]);
}

export function useBasedOnResize<T>(
  elementRef: Element | RefObject<Element | null>,
  fn: (entry: ResizeObserverEntry) => T,
): T | null {
  const [value, setValue] = useState<T | null>(null);

  const updateState = useCallback(
    (entry: ResizeObserverEntry) => {
      setValue(fn(entry));
    },
    [fn],
  );

  useOnResize(elementRef, updateState);

  return value;
}
