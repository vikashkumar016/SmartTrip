import {
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import EditTripPage from "./pages/EditTripPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Dashboard */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Trip Details */}

      <Route
        path="/trips/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TripDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Edit Trip */}

      <Route
        path="/trips/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditTripPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;