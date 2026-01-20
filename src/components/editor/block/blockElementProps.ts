import type { KeyboardEvent } from "react";

export interface BlockElementProps<T> {
    block: T;
    index: number;
    setRef: (el: HTMLElement | null) => void;
    keyDownOnBlock: (
        e: KeyboardEvent<HTMLElement>,
        blockIndex: number,
        action?: () => void
    ) => void;
};
