import PostCard from "../components/PostCard/PostCard";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
    return (
        <>
            <header className="flex items-center justify-center min-h-[30vh] lg:min-h-[45vh]">
                <h1 className="font-welcome text-7xl lg:text-9xl">High 👋.</h1>
            </header>

            <main className="flex flex-col items-center gap-16">
                <section className="px-4">
                    <SearchBar />
                </section>

                <section className="w-full px-4 flex flex-col items-center gap-8">
                    <h2 className="font-bold text-2xl">Suggested Posts</h2>
                    <PostCard
                        imgUrl="/neovim.png"
                        imgName="neovim logo"
                        postUrl="#"
                        date="Mar 11, 2025"
                        title="Full project rename in neovim and vim"
                        highFives={928}
                        comments={382}
                    />
                    <PostCard
                        imgUrl="/neovim.png"
                        imgName="neovim logo"
                        postUrl="#"
                        date="Mar 11, 2025"
                        title="Full project rename in neovim and vim"
                        highFives={928}
                        comments={382}
                    />
                    <button className="px-5 py-2 bg-background rounded border-2 border-border">
                        More Suggestions
                    </button>
                </section>
            </main>
        </>
    )
}

export default HomePage;