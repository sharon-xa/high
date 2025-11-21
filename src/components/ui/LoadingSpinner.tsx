type Props = {
    size?: "small" | "mid" | "big" | "huge";
    // if you use a custom string then you need the height and the border, ex: h-8 border-4
    customSize?: string;
}

const LoadingSpinner = ({ size, customSize }: Props) => {

    let spinnerSize: string = "";
    if (size === "small") spinnerSize = "h-4 border-2";
    else if (size === "mid") spinnerSize = "h-8 border-4";
    else if (size === "big") spinnerSize = "h-12 border-4";
    else if (size === "huge") spinnerSize = "h-16 border-6";

    if (customSize) spinnerSize = customSize;

    return (
        <div className="h-full flex justify-center items-center">
            <span
                className={`${spinnerSize} aspect-square animate-spin rounded-full border-white border-b-primary`}>
            </span>
        </div>
    )
}

export default LoadingSpinner;
