import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/userSlice";
import Footer from "./Footer";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getLatestUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res.success) {
        dispatch(SetUser(res.data));
      } else {
        console.log("gettting no token", localStorage.getItem("token"));
        dispatch(SetUser(null));
        localStorage.removeItem("token");
        toast.error(res.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetUser(null));
      console.log(error);
      localStorage.removeItem("token");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getLatestUser(localStorage.getItem("token"));
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="container px-3 max-w-screen-xl">
        {children}
        <Footer />
      </div>
    </>
  );
};

export default ProtectedRoute;
