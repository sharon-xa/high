import { createBrowserRouter, RouterProvider } from "react-router";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello World</div>,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
