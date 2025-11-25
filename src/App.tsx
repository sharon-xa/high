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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
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
            <Auth />
          </PublicOnlyRoute>
        )
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
        )
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
};
