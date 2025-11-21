import { House, Settings, SquarePen, User } from "lucide-react";
import { NavLink } from "react-router";

const Navbar = () => {
    return (
        <section className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 flex justify-center items-center gap-6 bg-black/5 border-2 border-border rounded backdrop-blur-2xl">
                <NavLink to={"/"} className={({ isActive }) => `aspect-square ${isActive ? "bg-background/75" : "bg-transparent"} rounded-full w-12 flex justify-center items-center`}>
                    <House size={28} />
                </NavLink>

                <NavLink to={"/new-post"} className={({ isActive }) => `aspect-square ${isActive ? "bg-background/75" : "bg-transparent"} rounded-full w-12 flex justify-center items-center`}>
                    <SquarePen size={28} />
                </NavLink>

                <NavLink to={"/settings"} className={({ isActive }) => `aspect-square ${isActive ? "bg-background/75" : "bg-transparent"} rounded-full w-12 flex justify-center items-center`}>
                    <Settings size={28} />
                </NavLink>

                <NavLink to={"/settings"} className={({ isActive }) => `aspect-square ${isActive ? "bg-background/75" : "bg-transparent"} rounded-full w-12 flex justify-center items-center`}>
                    <User size={28} />
                </NavLink>
            </div>
        </section >
    )
}

export default Navbar;