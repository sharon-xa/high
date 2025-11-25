type Props = {
    tag: string;
}

const Tag = ({ tag }: Props) => {
    return (
        <span className="px-3 py-1 bg-primary rounded-2xl">
            {tag}
        </span>
    )
}

export default Tag;