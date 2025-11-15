import type { LucideProps } from "lucide-react";
import { useRef, useState, type ForwardRefExoticComponent, type HTMLInputTypeAttribute, type RefAttributes } from "react";

type Props = {
    value: string;
    onChangeFunc: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    type: HTMLInputTypeAttribute;
    inputName?: string;
}

const Input = ({ value, onChangeFunc, Icon, type, inputName }: Props) => {
    const [activeInput, setActiveInput] = useState<boolean>(false);
    const calendarRef = useRef<HTMLInputElement>(null);

    const openCalendar = () => {
        if (calendarRef.current?.showPicker) {
            console.log(calendarRef.current);
            calendarRef.current.showPicker();
        } else {
            calendarRef.current?.focus();
        }
    };

    if (type === "date") {
        return (
            <div
                className={`flex items-center py-3 px-4 border-2 bg-[#2a2a2a] rounded-lg ${activeInput ? "active:border-[#adadad]" : "border-[#3a3a3a]"}`}
                onClick={openCalendar}
            >
                <Icon size={20} style={{ marginRight: "14px" }} color={`${activeInput ? "#fff" : "#888"}`} />

                <input
                    type="date"
                    name={inputName || type}
                    placeholder={inputName ? capitalize(inputName) : capitalize(type)}
                    value={value}
                    onChange={onChangeFunc}
                    ref={calendarRef}
                    className="bg-none border-none flex-1 outline-none"
                    required
                    onFocus={() => setActiveInput(true)}
                    onBlur={() => setActiveInput(false)}
                />
            </div>
        );
    }

    return (
        <div
            className={`flex items-center py-3 px-4 border-2 bg-[#2a2a2a] rounded-lg ${activeInput ? "active:border-[#adadad]" : "border-[#3a3a3a]"}`}
        >
            <Icon size={20} style={{ marginRight: "14px" }} color={`${activeInput ? "#fff" : "#888"}`} />

            <input
                type={type}
                name={inputName || type}
                placeholder={inputName ? capitalize(inputName) : capitalize(type)}
                value={value}
                onChange={onChangeFunc}
                className="bg-none border-none flex-1 outline-none"
                required
                onFocus={() => setActiveInput(true)}
                onBlur={() => setActiveInput(false)}
            />
        </div>
    )
}

export default Input;

function capitalize(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
}