import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { useEffect, useState } from "react";
import ActionButton from "./ActionButton";
import { Bold, Code, Highlighter, Image, Italic, Link } from "lucide-react";

const Toolbar = () => {
    const { selectedText, toolbarPosition, toggleStyle, applyLink, insertImage } = useToolbarStore();

    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        if (!window.visualViewport) return;

        const visualViewport = window.visualViewport;

        const handleResize = () => {
            const viewportHeight = visualViewport.height;
            const windowHeight = window.innerHeight;
            const calculatedKeyboardHeight = windowHeight - viewportHeight;

            setKeyboardHeight(calculatedKeyboardHeight);
        };

        handleResize();

        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('scroll', handleResize);
        };
    }, []);

    return (
        <div
            className="fixed outline outline-light-border bg-background text-white rounded-lg shadow-lg p-1 flex gap-1 z-50"
            style={{
                ...(isMobile
                    ? {
                        bottom: keyboardHeight > 50 ? `${keyboardHeight + 10}px` : '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }
                    : {
                        top: `${toolbarPosition.top}px`,
                        left: `${toolbarPosition.left}px`,
                        transform: 'translateX(-50%)',
                    }
                ),
                transition: 'bottom 0.2s ease, top 0.2s ease',
            }}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
        >
            <ActionButton
                action={() => toggleStyle("bold")}
                buttonName="bold"
                ButtonContent={Bold}
                isActive={(selectedText.typeOfStyle && (selectedText.typeOfStyle === "bold")) ? true : false}
            />
            <ActionButton
                action={() => toggleStyle("italic")}
                buttonName="italic"
                ButtonContent={Italic}
                isActive={(selectedText.typeOfStyle && (selectedText.typeOfStyle === "italic")) ? true : false}
            />
            <ActionButton
                action={() => toggleStyle("code")}
                buttonName="code"
                ButtonContent={Code}
                isActive={(selectedText.typeOfStyle && (selectedText.typeOfStyle === "code")) ? true : false}
            />
            <ActionButton
                action={() => toggleStyle("mark")}
                buttonName="mark"
                ButtonContent={Highlighter}
                isActive={(selectedText.typeOfStyle && (selectedText.typeOfStyle === "mark")) ? true : false}
            />
            <ActionButton
                action={() => {
                    const url = window.prompt("Link URL");
                    if (url) applyLink(url);
                }}
                buttonName="link"
                ButtonContent={Link}
                isActive={(selectedText.typeOfStyle && (selectedText.typeOfStyle === "link")) ? true : false}
            />
            <ActionButton
                action={() => {
                    const url = window.prompt("Image URL");
                    if (url) insertImage(url);
                }}
                buttonName="image"
                ButtonContent={Image}
            />
        </div>
    );
};

export default Toolbar;
