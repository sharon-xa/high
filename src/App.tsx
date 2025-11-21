import { createBrowserRouter, RouterProvider } from "react-router";
import { PublicOnlyRoute } from "./pages/PublicOnlyRoute";
import { AuthPage } from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Root from "./pages/Root";
import Error from "./pages/Error";

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
            <AuthPage />
          </PublicOnlyRoute>
        )
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
