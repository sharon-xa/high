import { useEffect, type RefObject } from "react";

const useAutoFocus = (elementRef: RefObject<HTMLElement | null>, shouldFocus: boolean) => {
	useEffect(() => {
		if (shouldFocus) {
			const timeoutId = setTimeout(() => {
				if (elementRef.current) {
					elementRef.current.focus();
				}
			}, 0);

			return () => clearTimeout(timeoutId);
		}
	}, [shouldFocus, elementRef]);
};

export default useAutoFocus;
