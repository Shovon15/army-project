import smoothScrollTo from "@/utils/helpers/smoothScrollTo";

/** Splits "/#about" into { pathname: "/", hash: "#about" }. */
export const splitHashPath = (path: string) => {
  const i = path.indexOf("#");
  if (i === -1) return { pathname: path, hash: "" };
  return { pathname: path.slice(0, i) || "/", hash: path.slice(i) };
};

const findHashTarget = (hash: string) =>
  hash.length > 1
    ? document.getElementById(decodeURIComponent(hash.slice(1)))
    : null;

/** Smooth-scrolls to the element for `hash`. Returns false if it isn't on the page. */
export const scrollToHash = (hash: string, offset = 0) => {
  const target = findHashTarget(hash);
  if (!target) return false;
  smoothScrollTo(target, { offset, duration: 1.1 });
  return true;
};

/**
 * After a route change the target section may not be rendered yet, so keep
 * trying for a short while. Returns a cancel function.
 */
export const scrollToHashWhenReady = (
  hash: string,
  { offset = 0, timeout = 2000 } = {},
) => {
  const start = performance.now();
  let frame = 0;
  const tick = () => {
    if (scrollToHash(hash, offset)) return;
    if (performance.now() - start < timeout) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
};
