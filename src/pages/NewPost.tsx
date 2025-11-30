import TextEditor from "../components/editor/TextEditor";

const NewPost = () => {
    return (
        <>
            <header className="min-h-48 flex justify-center items-center">
                <h1 className="font-welcome text-3xl">Write your post</h1>
            </header>
            <main className="bg-amber-950 w-[90%] mx-auto rounded">
                <TextEditor />
            </main>
        </>
    );
};

export default NewPost;
