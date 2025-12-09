import TextEditor from "../components/editor/TextEditor";

const NewPost = () => {
    return (
        <>
            <header className="min-h-48 flex justify-center items-center">
                <h1 className="font-welcome text-4xl font-black text-center mx-2">Write Your Post</h1>
            </header>
            <main className="w-[90%] mx-auto lg:w-[60%] lg:text-lg">
                <TextEditor />
            </main>
        </>
    );
};

export default NewPost;
