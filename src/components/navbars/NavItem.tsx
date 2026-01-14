import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { NavLink } from "react-router";

type Props = {
	Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
	to: string;
	className?: string;
	iconClassName?: string;
};

const NavItem = ({ Icon, to, className, iconClassName }: Props) => {
	return (
		<NavLink
			className={({ isActive }) =>
				`aspect-square ${isActive ? "bg-background/75" : "bg-transparent"} rounded-full w-12 flex justify-center items-center ${className}`
			}
			to={to}
		>
			<Icon size={26} className={iconClassName} />
		</NavLink>
	);
};

export default NavItem;
