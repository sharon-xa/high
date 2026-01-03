import { useEffect, type RefObject } from "react";

const useAutoFocus = (
	elementRef: RefObject<HTMLElement | null>,
	shouldFocus: boolean,
	setIsActive?: (bool: boolean) => void
) => {
	useEffect(() => {
		if (setIsActive) setIsActive(shouldFocus);
		if (shouldFocus) {
			const timeoutId = setTimeout(() => {
				if (elementRef.current) {
					elementRef.current.focus();
				}
			}, 0);

			return () => clearTimeout(timeoutId);
		}
	}, [shouldFocus, elementRef, setIsActive]);
};

export default useAutoFocus;
