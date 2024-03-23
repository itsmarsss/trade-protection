import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./styles.css";

export default function CursorFollower() {
  const cursorRef = useRef(null);

  const isTouchDevice = "ontouchstart" in window;
  useEffect(() => {
    const cursor = cursorRef.current;

    if (isTouchDevice || !cursor) {
      return;
    }

    window.addEventListener("mousemove", (e) => {
      const { target, x, y } = e;
      const isTargetLinkOrBtn =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest(".baritem") ||
        target.closest(".sidebar_option") ||
        target.closest(".pagemap") ||
        target.closest(".tooltip");
      gsap.to(cursor, {
        x:
          x -
          ((isTargetLinkOrBtn ? 1 / 3.5 : 1) *
            cursor.getBoundingClientRect().width) /
            2,
        y:
          y -
          ((isTargetLinkOrBtn ? 1 / 3.5 : 1) *
            cursor.getBoundingClientRect().height) /
            2,
        duration: 1,
        ease: "power4",
        opacity: isTargetLinkOrBtn ? 0.5 : 1,
        transform: `scale(${isTargetLinkOrBtn ? 3.5 : 1})`,
      });
    });

    document.addEventListener("mouseleave", () => {
      gsap.to(cursor, {
        duration: 1,
        opacity: 0,
      });
    });
  }, []);
  return <cursor className="cursor_follower" ref={cursorRef}></cursor>;
}
