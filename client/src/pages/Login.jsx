import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../apicalls/users";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";

const Login = () => {
  const emailRef = useRef();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const pwdRef = useRef();
  const [pwd, setPwd] = useState("");
  const [isPwdValid, setIsPwdValid] = useState(true);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    let areFieldsSet = true;
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
    const data = {
      email: email,
      password: pwd,
    };

    try {
      dispatch(showLoading()); // start loader
      const res = await loginUser(data);
      if (res.success) {
        toast.success(res.message);
        localStorage.setItem("token", res.token);
        emailRef.current.value = "";
        pwdRef.current.value = "";
        dispatch(hideLoading()); // stop loader
        window.location.href = "/";
        return;
      }

      // handle unverified user
      if (res.needsVerification) {
        toast.info(res.message || "Please verify your email.");

        const emailToUse = res.email || email;
        const otpExpiresAt = res.otpExpiresAt || null;

        localStorage.setItem("pendingEmail", emailToUse);
        if (otpExpiresAt) {
          localStorage.setItem("pendingOtpExpiresAt", otpExpiresAt);
        }

        dispatch(hideLoading());

        navigate("/verify-email", {
          state: { email: emailToUse, otpExpiresAt },
        });
        return;
      }

      
      toast.error(res.message);
      dispatch(hideLoading()); // stop loader
      
    } catch (err) {
      dispatch(hideLoading()); // stop loader
      toast.error(err.message || 'Something went wrong.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="container px-3 max-w-lg mt-16 pb-10 ">
        <ToastContainer />
        <h1 className="text-amber-300 text-4xl font-bold text-center mb-4">
          LOGIN
        </h1>
        <form className="p-4 md:p-8 rounded-md border" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white"
            >
              Email Address
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
            </div>
            {!isEmailValid && !email.length && (
              <span className="text-sm text-red-500">Email is required!</span>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Password
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
            </div>
            {!isPwdValid && !pwd.length && (
              <span className="text-sm text-red-500">
                Password is required!
              </span>
            )}
          </div>

          <div className="text-center mt-8">
            <button className="py-3 w-full w-6/12 border-amber-200 block mx-auto bg-amber-300 hover:bg-amber-400 hover:text-black text-black">
              LOGIN
            </button>
            <p className="text-center text-gray-200 mt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gray-400 hover:text-gray-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
