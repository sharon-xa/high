import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes, TouchEvent } from "react";

type Props = {
    className?: string;
    buttonName: string;
    tooltipDescription?: string;
    isMoblie?: boolean;
    ButtonContent?: string | ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

    // The condition in which the button is considered active
    isActive?: boolean;

    // The onClick Action
    action: () => void;
};

const ActionButton = ({ className, buttonName, tooltipDescription, isMoblie = false, ButtonContent, isActive, action }: Props) => {
    if (isMoblie) return (
        <button
            className={`
                ${isActive ? "bg-light-border/25" : ""} 
                hover:bg-light-border/25 
                active:bg-light-border/25
                rounded
                ${className}
                `}
            onTouchStart={(event: TouchEvent<HTMLButtonElement>) => {
                event.preventDefault();
                action();
            }}
            title={tooltipDescription}
        >
            {ButtonContent ? <ButtonContent name={buttonName} size={22} strokeWidth={2} /> : buttonName}
        </button>
    )
    else return (
        <button
            className={`
                ${isActive ? "bg-light-border/25" : ""} 
                hover:bg-light-border/25 
                active:bg-light-border/25
                rounded
                ${className}
                `}
            onClick={() => action()}
            title={tooltipDescription}
        >
            {ButtonContent ? <ButtonContent name={buttonName} size={22} strokeWidth={2} /> : buttonName}
        </button>
    )
}

export default ActionButton;
