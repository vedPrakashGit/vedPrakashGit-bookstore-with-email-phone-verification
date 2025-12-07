import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendOtp } from "../apicalls/users";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";


const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // email may come via navigation state or fallback from localStorage
  const initialEmail = location.state?.email || localStorage.getItem("pendingEmail") || "";
  const initialOtpExpiresAt = location.state?.otpExpiresAt ||
    localStorage.getItem("pendingOtpExpiresAt") ||
    null;

  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(true);

  const [otpExpiresAt, setOtpExpiresAt] = useState(initialOtpExpiresAt);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // if we somehow land here without email, redirect to register
    if (!initialEmail) {
      toast.error("No email found. Please register first.");
      navigate("/register");
      return;
    }

    if (!initialOtpExpiresAt) {
      // no expiry info, allow immediate resend
      setCanResend(true);
      return;
    }

    const expiryTime = new Date(initialOtpExpiresAt).getTime();
    const now = Date.now();
    const diffSeconds = Math.max(0, Math.floor((expiryTime - now) / 1000));

    if (diffSeconds <= 0) {
      setRemainingSeconds(0);
      setCanResend(true);
    } else {
      setRemainingSeconds(diffSeconds);
      setCanResend(false);
    }
  }, [initialEmail, initialOtpExpiresAt, navigate]);

  // countdown effect
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };  

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length === 0) {
      setIsOtpValid(false);
      return;
    }

    try {
      dispatch(showLoading());
      const res = await verifyEmail({ email, otp });

      if (res.success) {
        toast.success(res.message);

        // save token so user is logged in after verification
        if (res.token) {
          localStorage.setItem("token", res.token);
        }

        // cleanup pending email
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("pendingOtpExpiresAt");

         dispatch(hideLoading());
        // redirect to homepage
        window.location.href = "/";
      } else {
        toast.error(res.message || "Verification failed.");
        dispatch(hideLoading());
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleResend = async () => {
    try {
      if (!email) return;

      dispatch(showLoading());
      const res = await resendOtp({ email });

      if (res.success) {
        toast.success(res.message);

        const newExpiry = res.otpExpiresAt || null;
        setOtp("");
        setIsOtpValid(true);
        setOtpExpiresAt(newExpiry);

        if (newExpiry) {
          localStorage.setItem("pendingOtpExpiresAt", newExpiry);

          const expiryTime = new Date(newExpiry).getTime();
          const now = Date.now();
          const diffSeconds = Math.max(
            0,
            Math.floor((expiryTime - now) / 1000)
          );
          setRemainingSeconds(diffSeconds);
          setCanResend(false);
        } else {
          // fallback: allow immediate resend if no expiry returned
          setRemainingSeconds(0);
          setCanResend(true);
        }
      } else {
        toast.error(res.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong while resending OTP.");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <>
      <div className="container px-3 max-w-lg my-10">
        <ToastContainer />
        <h1 className="text-amber-300 text-4xl font-bold text-center mb-4">
          VERIFY EMAIL
        </h1>

        <form className="p-4 md:p-8 rounded-md border" onSubmit={submitHandler}>
          <div className="mb-4">
            <p className="text-gray-200 text-sm">
              We&apos;ve sent a 6-digit verification code to:
            </p>
            <p className="text-amber-300 font-semibold">{email}</p>
          </div>

          {otpExpiresAt && (
            <div className="mb-4 text-sm text-gray-300">
              {remainingSeconds > 0 ? (
                <span>
                  Code expires in{" "}
                  <span className="text-amber-300 font-semibold">
                    {formatTime(remainingSeconds)}
                  </span>
                </span>
              ) : (
                <span className="text-red-400">
                  Code has expired. Please resend a new code.
                </span>
              )}
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium leading-6 text-white"
            >
              Enter verification code
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setIsOtpValid(true);
                }}
                className="block w-full rounded-md border-0 py-3 px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset-0 focus:ring-indigo-600 sm:leading-6"
                placeholder="6-digit code"
                maxLength={6}
              />
            </div>
            {!isOtpValid && !otp.length && (
              <span className="text-sm text-red-500">
                Verification code is required!
              </span>
            )}
          </div>

          <div className="text-center mt-8">
            <button className="py-3 w-6/12 border-amber-200 block mx-auto bg-amber-300 hover:bg-amber-400 hover:text-black outline-current">
              VERIFY
            </button>

            {canResend && (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-amber-300 hover:text-amber-200 underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <p className="text-center text-gray-200 mt-4 text-sm">
            Enter the code you received in your email. If you don&apos;t see it,
            check your spam folder (in production with a real SMTP).
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default VerifyEmail;