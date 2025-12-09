import { Bold, Image, Italic, Link, Plus } from "lucide-react";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import { useEffect, useState } from "react";

const MobileToolBar = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const [keyboardInset, setKeyboardInset] = useState(0);
    const { toggleStyle, applyLink, insertImage } = useToolbarStore();

    useEffect(() => {
        const visualViewport = window.visualViewport;

        if (!visualViewport) return;

        const handleResize = () => {
            const viewportHeight = visualViewport.height;
            const windowHeight = window.innerHeight;
            const offsetTop = visualViewport.offsetTop || 0;
            const inset = windowHeight - (viewportHeight + offsetTop);

            if (inset > 50) {
                setKeyboardInset(inset);
            } else {
                setKeyboardInset(0);
            }
        };
        handleResize();

        visualViewport.addEventListener('resize', handleResize);
        visualViewport.addEventListener('scroll', handleResize);

        return () => {
            visualViewport.removeEventListener('resize', handleResize);
            visualViewport.removeEventListener('scroll', handleResize);
        };
    }, [isMobile]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-background/10 backdrop-blur-lg border-t-2 border-border z-50"
            style={{
                bottom: keyboardInset > 0 ? `${keyboardInset}px` : '0px',
                transition: 'bottom 0.1s ease'
            }}
        >
            <div className="flex items-center justify-center gap-0">
                <button
                    onClick={() => toggleStyle("bold")}
                    className="p-3 hover:bg-gray-800 rounded-lg active:bg-gray-700 transition-colors"
                    aria-label="Bold"
                >
                    <Bold size={22} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => toggleStyle("italic")}
                    className="p-3 hover:bg-gray-800 rounded-lg active:bg-gray-700 transition-colors"
                    aria-label="Italic"
                >
                    <Italic size={22} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => {
                        const url = window.prompt("Link URL");
                        if (url) applyLink(url);
                    }}
                    className="p-3 hover:bg-gray-800 rounded-lg active:bg-gray-700 transition-colors"
                    aria-label="Link"
                >
                    <Link size={22} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => {
                        const url = window.prompt("Image URL");
                        if (url) insertImage(url);
                    }}
                    className="p-3 hover:bg-gray-800 rounded-lg active:bg-gray-700 transition-colors"
                    aria-label="Image"
                >
                    <Image size={22} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => { }}
                    className="p-3 hover:bg-gray-800 rounded-lg active:bg-gray-700 transition-colors"
                    aria-label="More options"
                >
                    <Plus size={22} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}

export default MobileToolBar;
