import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
    className?: string;
    buttonName: string;
    ButtonContent?: string | ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

    // The condition in which the button is considered active
    isActive?: boolean;

    // The onClick Action
    action: () => void;
};

const ActionButton = ({ className, buttonName, ButtonContent, isActive, action }: Props) => {
    return (
        <button
            className={`
                ${isActive ? "bg-light-border/25" : ""} 
                hover:bg-light-border/25 
                active:bg-light-border/25
                rounded
                ${className}
                `}
            onClick={() => action()}
        >
            {ButtonContent ? <ButtonContent name={buttonName} size={22} strokeWidth={2} /> : buttonName}
        </button>
    )
}

export default ActionButton;
