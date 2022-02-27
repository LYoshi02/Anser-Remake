import { useEffect, useRef } from "react";

function useScrollToBottom<RefType extends HTMLElement>() {
  const elementRef = useRef<RefType>(null);

  const scrollToBottom = () => {
    elementRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  });

  return elementRef;
}

export default useScrollToBottom;
