import { House, LogIn, Settings, SquarePen, User } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import NavItem from "./NavItem";

const Navbar = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <section className="w-[90%] fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 flex justify-around items-center gap-6 bg-black/5 border-2 border-border rounded backdrop-blur-2xl">
                <NavItem Icon={House} to="/" />
                <NavItem Icon={SquarePen} to="/new-post" />
                <NavItem Icon={Settings} to="/settings" />
                {
                    isAuthenticated ?
                        <NavItem Icon={User} to="/profile" /> :
                        <NavItem Icon={LogIn} to="/auth" iconClassName="-translate-x-0.5" />
                }
            </div>
        </section>
    )
}

export default Navbar;
