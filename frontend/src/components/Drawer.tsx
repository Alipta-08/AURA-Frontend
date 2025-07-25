import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SavedChats from "./SavedChats";

const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT;

const Drawer = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [chats, setChats] = useState<[{ _id: string }] | null>(null);

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(AUTH_ENDPOINT + "/user", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.user.name);
        setChats(data.user.chats);
      } else {
        setUsername("");
      }
    };

    getUser();
  }, [isAuthenticated, navigate]);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="group btn btn-square btn-ghost rounded-box drawer-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current group-hover:scale-110 group-hover:text-primary transition-all duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-300 text-base-content min-h-full w-64 p-4 gap-3">
          <Link to="/" className="m-2 btn btn-ghost text-xl rounded-box">
            AURA 
          </Link>
          {!isAuthenticated ? (
            <button
              className="btn btn-outline hover:btn-primary rounded-box hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/login/signin")}
            >
              Sign in
            </button>
          ) : (
            <>
              <p className="m-2 text-lg text-center">Hi, {username}</p>
              {chats && chats.length > 0 && <SavedChats chats={chats} />}
              <button
                className="btn btn-outline hover:btn-primary rounded-box hover:scale-105 transition-all duration-300"
                onClick={handleSignOut}
              >
                Sign out
              </button>
              {isAdmin && (
                <button
                  className="btn btn-outline rounded-box md:hidden"
                  onClick={() => navigate("/upload")}
                >
                  Upload
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
