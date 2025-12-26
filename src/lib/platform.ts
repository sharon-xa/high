export const IS_TOUCH = "ontouchstart" in window || navigator.maxTouchPoints > 0;

export const IS_MOBILE = IS_TOUCH || /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
