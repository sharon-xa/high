import { Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Navbar from "../components/navbars/Navbar";

const Root = () => {
    const { isLoading } = useAuthStore();

    return (
        <main className="min-h-dvh pb-28">
            <div className="max-w-[1200px] mx-auto relative">
                {isLoading ? <LoadingSpinner size="huge" /> : <Outlet />}
            </div>
            <Navbar />
        </main>
    );
};

export default Root;
