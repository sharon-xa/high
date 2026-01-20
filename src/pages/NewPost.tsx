import TextEditor from "../components/editor/TextEditor";

import { StepBack } from "lucide-react";
import { useContext } from "react";
import { NavigationContext } from "../contexts/NavigationContext";

const NewPost = () => {
	const navigate = useContext(NavigationContext);

	return (
		<>
			<header className="relative min-h-48 flex justify-center items-center">
				<button
					className="cursor-pointer absolute left-56 bg-light-border/25 p-3 rounded-full hover:bg-light-border/50"
					onClick={() => navigate?.goBack()}
				>
					<StepBack size={28} />
				</button>
				<h1 className="font-welcome text-4xl font-black text-center mx-2">
					Write Your Post
				</h1>
			</header>
			<TextEditor />
		</>
	);
};

export default NewPost;
