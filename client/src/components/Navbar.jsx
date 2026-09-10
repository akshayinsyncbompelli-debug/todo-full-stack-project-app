import { useNavigate } from "react-router-dom";

import api from "../api";

function Navbar({
  user,
  setUser,
}) {

  const navigate = useNavigate();


  const logout = async () => {

    try {

      await api.post(
        "/api/auth/logout"
      );

      setUser(null);

      navigate("/login");

    } catch (error) {

      console.log(error);
    }
  };


  return (
    <header className="navbar">

      <div className="nav-inner">

        <div className="nav-brand">

          <div className="brand-icon">
            ✓
          </div>

          <span>
            TaskFlow
          </span>

        </div>


        <div className="nav-right">

          <div className="user-info">

            <div className="avatar">
              {user.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-details">

              <strong>
                {user.name}
              </strong>

              <span>
                {user.email}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;