import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import api from "./api";

function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);


  const checkUser = async () => {

    try {

      const response =
        await api.get("/auth/me");

      setUser(response.data);

    } catch (error) {

      setUser(null);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    checkUser();
  }, []);


  if (loading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }


  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : <Login setUser={setUser} />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/" />
              : <Register setUser={setUser} />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Dashboard
                user={user}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;