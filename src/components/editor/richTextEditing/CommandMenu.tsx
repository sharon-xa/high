import { Image } from "lucide-react";
import { useCommandMenuStore } from "../../../stores/editorStores/commandMenuStore";
import ActionButton from "./ActionButton";

const CommandMenu = () => {
    const { setIsCommandMenuOpen } = useCommandMenuStore();

    return (
        <div className="fixed outline outline-light-border bg-border text-white rounded-lg shadow-lg p-1 flex gap-1 z-50">
            <ActionButton
                action={() => setIsCommandMenuOpen(false)}
                buttonName="insert image"
                ButtonContent={Image}
            />
        </div>
    );
};

export default CommandMenu;
