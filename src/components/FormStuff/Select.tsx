import type { LucideProps } from "lucide-react";
import { useRef, useState, type ForwardRefExoticComponent, type RefAttributes } from "react";

type Option = {
    Title: string;
    Value: string;
    Disabled?: boolean;
}

type Props = {
    value: string;
    onChangeFunc: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    options: Option[];
    inputName?: string;
}

const Select = ({ value, onChangeFunc, Icon, inputName, options }: Props) => {
    const [activeInput, setActiveInput] = useState<boolean>(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    const openSelect = () => {
        if (selectRef.current?.showPicker) {
            selectRef.current.showPicker();
        } else {
            selectRef.current?.focus();
        }
    };

    return (
        <div
            className={`
                flex items-center py-3 px-4 border-2
                ${activeInput ? "active:border-[#adadad]" : "border-[#3a3a3a]"}
                bg-[#2a2a2a] rounded-lg
            `}
            onClick={openSelect}
            onFocus={() => setActiveInput(true)}
            onBlur={() => setActiveInput(false)}
        >
            <Icon
                size={20}
                style={{ marginRight: "14px" }}
                color={`${activeInput ? "#fff" : "#888"}`}
            />

            <select
                name={inputName}
                value={value}
                onChange={onChangeFunc}
                required
                ref={selectRef}
                className={`bg-transparent border-none flex-1 outline-none cursor-pointer ${value ? "text-white" : "text-[#888]"}`}
            >
                {options.map((option) =>
                    <option
                        value={option.Value}
                        disabled={option.Disabled}
                        className="bg-[#2a2a2a]"
                        key={option.Value}
                    >
                        {option.Title}
                    </option>
                )}
            </select>
        </div >
    )
}

export default Select;
