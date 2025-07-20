import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const New = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      } else {
        try {
          const { data } = await axios.post(
            "http://localhost:4000",
            {},
            { withCredentials: true }
          );
          const { status, user } = data;
          setUsername(user);
          if (status) {
            toast(`Hello ${user}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            removeCookie("token");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          removeCookie("token");
          navigate("/login");
        }
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-[#020024] via-[#70a3b7] to-[#E6A4B4] font-verdana">
        <div className="bg-white p-8 rounded-lg w-full max-w-sm shadow-2xl">
          <h4 className="text-3xl text-white mb-4">
            Welcome <span className="text-[#7bb9c6]">{username}</span>
          </h4>
          <button
            onClick={Logout}
            className="bg-[#1b4953] text-white cursor-pointer py-3 px-6 text-xl rounded-full transition ease-in duration-300 hover:bg-[#79a1a9]"
          >
            LOGOUT
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default New;
