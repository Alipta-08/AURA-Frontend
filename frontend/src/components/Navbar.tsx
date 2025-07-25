import { FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Drawer from "./Drawer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const CHAT_SAVE_ENDPOINT = import.meta.env.VITE_FETCH_CHAT_ENDPOINT;

const Navbar = () => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  const handleNewChat = async () => {
    try {
      const chat = localStorage.getItem("chat");
      const messages = chat ? JSON.parse(chat) : [];
      if (messages.length > 1) {
        const response = await fetch(CHAT_SAVE_ENDPOINT, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
          }),
        });
        const data = await response.json();

        if (response.status === 401) {
          toast.error("Please login to save your chat.");
        } else if (response.status === 201) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      toast.error("Error saving chat.");
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="sticky w-full bg-base-100 shadow-md rounded-box z-50 top-0">
      <div className="navbar">
        <div className="flex-none">
          <Drawer />
        </div>
        <div className="flex-1">
          <Link
            to="/"
            className="m-2 btn btn-ghost text-xl rounded-box transition-all duration-300 hover:scale-105"
          >
            AURA
          </Link>
        </div>
        <div className="flex-none">
          <FiEdit3
            onClick={handleNewChat}
            className="m-2 p-3 btn btn-circle btn-ghost scale-105 transition-all duration-300 hover:text-primary hover:scale-125"
          />
          {isAuthenticated && isAdmin && (
            <Link
              to="/upload"
              className="m-2 btn btn-ghost hidden md:inline-flex rounded-box transition-all duration-300 hover:text-primary hover:scale-105"
            >
              Upload
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
