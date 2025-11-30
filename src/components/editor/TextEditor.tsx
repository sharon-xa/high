import { Plus } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";

const TextEditor = () => {
    const { title, updateTitle } = useEditorStore();

    return (
        <section className="min-h-96">

            <main className="">
                <h1 className=""></h1>
            </main>

            <button className="p-4 bg-primary rounded-full fixed bottom-24 right-5">
                <Plus />
            </button>
        </section>
    );
};

export default TextEditor;
