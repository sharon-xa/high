export type BlockType =
    "header" |
    "paragraph" |
    "image" |
    "separator" |
    "code";

export type HeaderLevels = 1 | 2 | 3;

type BaseBlock = {
    uuid: string;
}

export type HeaderBlock = BaseBlock & {
    type: "header";
    level: HeaderLevels;
    content: string;
}

export type ParagraphBlock = BaseBlock & {
    type: "paragraph";
    content: string;
}

export type ImageBlock = BaseBlock & {
    type: "image";
    url: string;
    alt: string;
}

export type SeparatorBlock = BaseBlock & {
    type: "separator";
}

export type CodeBlock = BaseBlock & {
    type: "code";
    content: string;
    language?: string;
}

export type Block = HeaderBlock | ParagraphBlock | ImageBlock | SeparatorBlock | CodeBlock;
