import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { registerUser } from "../apicalls/users";
import Footer from "../components/Footer";
import { showLoading, hideLoading } from "../redux/loaderSlice";


const Register = () => {
  const nameRef = useRef();
  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const emailRef = useRef();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const pwdRef = useRef();
  const [pwd, setPwd] = useState("");
  const [isPwdValid, setIsPwdValid] = useState(true);
  const [userType, setUserType] = useState("user");
  const dispatch = useDispatch();


  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    let areFieldsSet = true;
    if (name == "" || name.trim().length == 0) {
      setIsNameValid(false);
      areFieldsSet = false;
    }

    if (email == "" || email.trim().length == 0) {
      setIsEmailValid(false);
      areFieldsSet = false;
    }

    if (pwd == "" || pwd.trim().length == 0) {
      setIsPwdValid(false);
      areFieldsSet = false;
    }

    if (!areFieldsSet) {
      return;
    }

    let data = {
      name: name,
      email: email,
      password: pwd,
      isAdmin: userType === "admin" ? true : false,
    };

    try {
      dispatch(showLoading()); // start loader
      const res = await registerUser(data);

      if (res.success) {
        toast.success(res.message);
        nameRef.current.value = "";
        emailRef.current.value = "";
        pwdRef.current.value = "";
        
        const emailToUse = res.email || email;
        const otpExpiresAt = res.otpExpiresAt || null;

        localStorage.setItem("pendingEmail", emailToUse);
        if (otpExpiresAt) {
          localStorage.setItem("pendingOtpExpiresAt", otpExpiresAt);
        }

        navigate("/verify-email", {
          state: { email: emailToUse, otpExpiresAt },
        });

      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      dispatch(hideLoading()); // stop loader
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="container px-3 max-w-lg my-10">
        <ToastContainer />
        <h1 className="text-amber-300 text-4xl font-bold text-center mb-4">
          REGISTER
        </h1>
        <form className="p-4 md:p-8 rounded-md border" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-white"
            >
              Name*
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                ref={nameRef}
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-3 px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset-0 focus:ring-indigo-600 sm:leading-6"
                placeholder="Enter your name"
              />
            </div>
            {!isNameValid && !name.length && (
              <span className="text-sm text-red-500">Name is required!</span>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Email Address*
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                ref={emailRef}
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-3 px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset-0 focus:ring-indigo-600 sm:leading-6"
                placeholder="Enter email address"
              />
              {!isEmailValid && !email.length && (
                <span className="text-sm text-red-500">Email is required!</span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Password*
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                ref={pwdRef}
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                className="block w-full rounded-md border-0 py-3 px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset-0 focus:ring-indigo-600 sm:leading-6"
                placeholder="Enter the password"
              />
              {!isPwdValid && !pwd.length && (
                <span className="text-sm text-red-500">
                  Password is required!
                </span>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium leading-6 text-white">
              Select the user type
            </label>
            <div className="user-type flex border overflow-hidden rounded-md border-gray-300 mt-3">
              <div className="flex-1 text-center text-white">
                <input
                  type="radio"
                  name="userType"
                  hidden
                  id="admin"
                  onClick={() => setUserType("admin")}
                />
                <label
                  htmlFor="admin"
                  className={`block py-3 cursor-pointer ${
                    userType == "admin" ? "active" : ""
                  }`}
                >
                  Admin
                </label>
              </div>
              <div className="flex-1 text-center text-white">
                <input
                  type="radio"
                  name="userType"
                  hidden
                  id="user"
                  onClick={() => setUserType("user")}
                />
                <label
                  htmlFor="user"
                  className={`block py-3 cursor-pointer ${
                    userType == "user" ? "active" : ""
                  }`}
                >
                  User
                </label>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="py-3 w-6/12 border-amber-200 block mx-auto bg-amber-300 hover:bg-amber-400 hover:text-black text-black">
              REGISTER
            </button>
            <p className="text-center text-gray-200 mt-2">
              Already have an account with us?{" "}
              <Link to="/login" className="text-gray-400 hover:text-gray-300">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
