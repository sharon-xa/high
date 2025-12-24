import { useEffect, useState } from "react";
import { useToolbarStore } from "../../../stores/editorStores/toolbarStore";
import MobileToolbarTextStyleActions from "./MobileToolbarTextStyleActions";
import MobileToolbarBlockActions from "./MobileToolbarBlockActions";
import { IS_MOBILE } from "../../../lib/platform";

const MobileToolBar = () => {
    const [keyboardInset, setKeyboardInset] = useState(0);
    const { isToolbarVisible } = useToolbarStore();

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
    }, [IS_MOBILE]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-background/10 backdrop-blur-lg border-t-2 border-border z-50"
            style={{
                bottom: keyboardInset > 0 ? `${keyboardInset}px` : '0px',
                transition: 'bottom 0.1s ease'
            }}
        >
            <div className="flex items-center justify-center gap-2 py-1">
                {
                    isToolbarVisible ?
                        <MobileToolbarTextStyleActions /> :
                        <MobileToolbarBlockActions />
                }
            </div>
        </div>
    )
}

export default MobileToolBar;
