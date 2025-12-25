import type { TextStylesCommand } from "./toolbar.types";

export type StyledText = {
	isStyled: boolean;
	typesOfStyle: Set<TextStylesCommand>;
};
