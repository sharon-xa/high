export const IS_TOUCH =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

export const IS_MOBILE =
    IS_TOUCH ||
    /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
