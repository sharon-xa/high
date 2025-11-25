import { Outlet } from "react-router";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Navbar from "../../components/navbars/NavBar";
import { useAuthState } from "../../hooks/useAuth";

const Root = () => {
    const { isPending } = useAuthState();

    return (
        <main className="min-h-dvh pb-28">
            <div className="max-w-[1200px] mx-auto">
                {isPending ? <LoadingSpinner size="huge" /> : <Outlet />}
            </div>
            <Navbar />
        </main>
    );
};

export default Root;
