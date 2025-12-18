import { Braces, Code, Image, SeparatorHorizontal } from "lucide-react";
import ActionButton from "./ActionButton";

const MobileToolbarBlockActions = () => {
    return (
        <>
            <ActionButton
                action={() => { }}
                buttonName="codeblock"
                className="p-2"
                ButtonContent={Braces}
                tooltipDescription="CodeBlock"
            />
            <ActionButton
                action={() => { }}
                buttonName="image"
                className="p-2"
                ButtonContent={Image}
                tooltipDescription="Image"
            />
            <ActionButton
                action={() => { }}
                buttonName="separator"
                className="p-2"
                ButtonContent={SeparatorHorizontal}
                tooltipDescription="Separator"
            />
            <ActionButton
                action={() => { }}
                buttonName="embed"
                className="p-2"
                ButtonContent={Code}
                tooltipDescription="embed"
            />
        </>
    );
};

export default MobileToolbarBlockActions;
