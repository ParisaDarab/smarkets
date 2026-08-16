import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/login';
import { Home } from './pages/home';
import { Event } from './pages/event';
import { ProtectedRoute } from './routes/authProtected';
export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/event"
        element={
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
