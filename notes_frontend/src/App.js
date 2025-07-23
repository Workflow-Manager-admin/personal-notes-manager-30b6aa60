import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getToken, getUser, clearAuth } from "./utils/auth";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NotesLayout from "./components/NotesLayout";
import "./App.css";

// -- Public Auth Context for app-wide auth state
export const AuthContext = React.createContext(null);

// PUBLIC_INTERFACE
function App() {
  const [auth, setAuth] = useState(() => {
    const token = getToken();
    return token ? { token, user: getUser() } : null;
  });

  useEffect(() => {
    // Autoforce logout if token/user cleared elsewhere
    if (auth && !getToken()) setAuth(null);
  }, [auth]);

  const login = (token, user) => setAuth({ token, user });
  const logout = () => {
    clearAuth();
    setAuth(null);
  };

  const authValue = useMemo(
    () => ({
      user: auth?.user,
      token: auth?.token,
      login,
      logout,
      isAuthenticated: !!auth,
    }),
    [auth]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!auth ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!auth ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/*"
            element={auth ? <NotesLayout /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
