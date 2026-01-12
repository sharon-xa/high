import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

import PublicOnlyRoute from "./pages/otherPages/PublicOnlyRoute";
import ProtectedRoute from "./pages/otherPages/ProtectedRoute";
import Root from "./pages/otherPages/Root";
import Error from "./pages/otherPages/Error";

import Auth from "./pages/Auth";
import HomePage from "./pages/Home";
import NewPost from "./pages/NewPost";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { AuthFormsProvider } from "./contexts/AuthFormsContext";

const SECOND = 1000;
const MINUTE = SECOND * 60;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: MINUTE * 5,
			gcTime: MINUTE * 10,
			retry: 1,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
		mutations: {
			retry: 0,
		},
	},
});

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: "auth",
				element: (
					<PublicOnlyRoute>
						<AuthFormsProvider>
							<Auth />
						</AuthFormsProvider>
					</PublicOnlyRoute>
				),
			},
			{
				path: "new-post",
				element: <NewPost />,
			},
			{
				path: "settings",
				element: <Settings />,
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				),
			},
		],
	},
]);

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}
