import type { TextStylesCommand } from "../../types/editor/toolbar.types";

export function toggleFormat(
    command: TextStylesCommand,
    href?: string
): string {
    /**
        * DOM-based toggling.  
        *  - Gets current selection  
        *  - Detects if already inside the formatting tag  
        *  - Wraps or unwraps accordingly  
        *  - For link: uses <a href="...">  
        *  - For bold: <strong>, italic: <em>, code: <code>, mark: <mark>  
        *  - Never uses string manipulation or innerHTML replacement  
    */

    return ""
};