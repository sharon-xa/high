import { Outlet, useLocation } from "react-router";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Navbar from "../../components/navbars/NavBar";
import { useAuthState } from "../../hooks/useAuth";
import GlobalProviders from "../../contexts/GlobalProviders";

const Root = () => {
	const { isPending } = useAuthState();
	const location = useLocation();
	const isEditorPage = location.pathname === "/new-post";

	return (
		<GlobalProviders>
			<main className="min-h-dvh pb-28">
				<div className="max-w-[1200px] mx-auto">
					{isPending ? <LoadingSpinner size="huge" /> : <Outlet />}
				</div>
				{!isEditorPage && <Navbar />}
			</main>
		</GlobalProviders>
	);
};

export default Root;
