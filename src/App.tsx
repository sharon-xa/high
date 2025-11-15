import { BrowserRouter, Route, Routes } from "react-router";
import { PublicOnlyRoute } from "./pages/PublicOnlyRoute";
import { AuthPage } from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          index
          element={
            <HomePage />
          }
        />

        {/* Public routes - redirect to dashboard if already logged in */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes - require authentication */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogPost />
            </ProtectedRoute>
          }
        /> */}

        {/* Default redirect */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

        {/* 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
