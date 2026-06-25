import "./App.css";

import Header from "./components/Header.jsx";
import { Outlet } from "react-router";
import { AuthContext } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";

function App() {
  const [user, setUser] = useAuth();
  return (
    <>
      <AuthContext value={[user, setUser]}>
        <Header />
        <Outlet />
      </AuthContext>
    </>
  );
}

export default App;
