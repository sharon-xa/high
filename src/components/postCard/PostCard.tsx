import { MessageCircle, Hand } from "lucide-react";
import Tag from "./Tag";

type Props = {
	postUrl: string;
	imgUrl: string;
	imgName: string;
	title: string;
	date: string;
	highFives: number;
	comments: number;
};

const PostCard = ({ imgUrl, imgName, postUrl, title, date, highFives, comments }: Props) => {
	return (
		<a
			href={postUrl}
			className="w-[90%] bg-black border-2 border-border rounded shadow-2xl flex flex-col items-center gap-3"
		>
			<div className="p-2.5 flex justify-center items-center">
				<img src={imgUrl} alt={imgName} className="max-w-full h-auto object-contain" />
			</div>
			<div className="p-4 flex flex-col gap-2">
				<span className="text-white-75">{date}</span>
				<div className="flex flex-col gap-6">
					<h2 className="text-2xl font-bold">{title}</h2>
					<div className="flex flex-wrap gap-2">
						<Tag tag="CLI" />
						<Tag tag="Programming" />
						<Tag tag="Vim" />
						<Tag tag="Text Editor" />
					</div>
					<div className="flex justify-between items-center min-h-8">
						<div className="flex items-center justify-center gap-3">
							<Hand size={20} />
							<span>{highFives}</span>
						</div>
						<div className="flex items-center justify-center gap-3">
							<MessageCircle size={20} />
							<span>{comments}</span>
						</div>
					</div>
				</div>
			</div>
		</a>
	);
};

export default PostCard;
