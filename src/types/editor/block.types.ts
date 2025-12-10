export type Metadata = {
    headerLevel?: 1 | 2 | 3;
    alt?: string; // for images
    url?: string; // for images
};

export type BlockType =
    "headerOne" |
    "headerTwo" |
    "headerThree" |
    "paragraph" |
    "image" |
    "separator" |
    "code";

export type Block = {
    uuid: string;
    type: BlockType;
    content: string;
    metadata?: Metadata;
}
