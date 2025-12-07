// src/components/PhoneVerifyModal.jsx
import { useEffect, useRef, useState } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAppInstance } from "../firebase";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { axiosInstance } from "../apicalls";

const PhoneVerifyModal = ({ onClose, onVerified }) => {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("enterPhone"); // enterPhone | enterCode
  const [confirmationResultObj, setConfirmationResultObj] = useState(null);
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [sending, setSending] = useState(false);    // for Send Code
  const [verifying, setVerifying] = useState(false); // for Verify Phone

  const recaptchaRef = useRef(null);

  const startServerSession = async (phoneToUse) => {
    // send proper key: { phone }
    const res = await axiosInstance.post(
      "/api/users/start-phone-verification",
      { phone: phoneToUse }
    );
    return res.data; // expecting server response data
  };

  // robust setupRecaptcha
  const setupRecaptcha = async () => {
    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch {}
        window.recaptchaVerifier = null;
      }

      const auth = getAuth(firebaseAppInstance);

      const el = document.getElementById("recaptcha-container");
      if (!el) throw new Error("recaptcha container not found in DOM");

        // ✅ NEW PARAM ORDER: auth FIRST, then container, then params
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );

        await window.recaptchaVerifier.render();
        return window.recaptchaVerifier;
      } catch (err) {
        console.error("setupRecaptcha error:", err);
        throw err;
      }
    };


    // handleSendCode (replace your current recaptcha + signInWithPhoneNumber part)
    const handleSendCode = async (e) => {
      e.preventDefault();
      if (sending) return; // ignore double-clicks
      if (!phone) {
        toast.error("Enter phone in E.164 format e.g. +9198XXXXXXXX");
        return;
      }

      try {
        setSending(true);
        const startRes = await startServerSession(phone);
        if (!startRes || !startRes.success) {
          toast.error(startRes?.message || "Could not start verification");
          return;
        }

        // --- START: set countdown from server expiry or fallback to 120s ---
        if (startRes.otpExpiresAt) {
          const expiry = new Date(startRes.otpExpiresAt).getTime();
          const now = Date.now();
          const seconds = Math.max(0, Math.floor((expiry - now) / 1000));
          setRemainingSeconds(seconds);
          setCanResend(seconds <= 0);
        } else {
          // fallback: 2 minutes if server didn't send an expiry
          setRemainingSeconds(120);
          setCanResend(false);
        }
        // --- END: countdown setup ---

        const appVerifier = await setupRecaptcha();
        const auth = getAuth(firebaseAppInstance);

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phone,
          appVerifier
        );

        setConfirmationResultObj(confirmationResult);
        setStep("enterCode");
        toast.info("SMS sent. Enter the code.");
      }  catch (err) {
          console.error("handleSendCode error:", err);
          if (err.code === "auth/too-many-requests") {
            toast.error(
              "Too many verification attempts. Please wait a few minutes before trying again."
            );
          } else {
            toast.error(err?.message || "Failed to send SMS.");
          }
          if (window.recaptchaVerifier) {
            try { window.recaptchaVerifier.clear(); } catch {}
            window.recaptchaVerifier = null;
          }
        }finally {
        setSending(false);
      }
    };


  // countdown timer
  useEffect(() => {
    if (remainingSeconds <= 0) {
      setCanResend(true);
      return;
    }
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

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    if (verifying) return;
    if (!confirmationResultObj) {
      toast.error("No confirmation in progress.");
      return;
    }
     // optional guard: block verify if timer already hit 0
    if (remainingSeconds <= 0) {
      toast.error("Verification code has expired. Please resend a new code.");
      return;
    }
    try {
      setVerifying(true);
      const userCredential = await confirmationResultObj.confirm(code);
      const firebaseIdToken = await userCredential.user.getIdToken();

      const res = await axiosInstance.post("/api/users/verify-phone", {
        firebaseIdToken
      });

      if (res.data && res.data.success) {
        toast.success("Phone verified!");
        onClose();

        if (onVerified) {
          onVerified();
        }
      } else {
        toast.error(res.data?.message || "Verification failed.");
      }
    } catch (error) {
      console.error("handleConfirmCode error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Verification failed.";
      toast.error(msg);
    }finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    // reset and let user re-send new code
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
      window.recaptchaVerifier = null;
    }
    setStep("enterPhone");
    setCode("");
    setConfirmationResultObj(null);
    setCanResend(false);
    setRemainingSeconds(0);
    // optional: you could directly call handleSendCode(phone) here to auto-resend
  };

  return (
    <div className="modal-body">
      <div className="flex items-center justify-between border-b-2 border-gray-500 mb-4">
        <h3 className="text-black text-2xl font-bold">Verify Your Phone Number</h3>
        <AiOutlineClose className="text-black cursor-pointer" onClick={onClose} />
      </div>

      <div id="recaptcha-container" ref={recaptchaRef}></div>

      {step === "enterPhone" && (
        <form onSubmit={handleSendCode}>
          <div className="text-center pt-4 pb-4 w-3/5 mx-auto">
            <span className="text-4xl text-amber-500">&#128241;</span>
            <h3 className="text-black text-lg font-semibold mt-2">Enter Your Phone Number</h3>
            <div className="mb-4 mt-6">
              <label className="block" htmlFor="phone">
                <span className="block text-sm font-medium text-slate-700 mb-2">Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder="+9198XXXXXXXX"
                />
              </label>
            </div>
            <div className="modal-footer block sm:flex gap-3 pt-2 mt-4">
              <button type="button" onClick={onClose} className="py-2 w-full border-gray-900 flex-1 bg-transparent text-black hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="py-2 w-full flex-1 bg-amber-300 hover:bg-amber-400 text-black"
              >
                {sending ? "Sending..." : "Send Code"}
              </button>
            </div>
          </div>
        </form>
      )}

      {step === "enterCode" && (
        <form onSubmit={handleConfirmCode}>
          <div className="text-center pt-4 pb-8">
            <span className="text-4xl text-amber-500">&#9989;</span>
            <h3 className="text-black text-lg font-semibold mt-2">Enter Verification Code</h3>
            <p className="text-slate-600 text-sm mt-2">Code sent to <strong>{phone}</strong></p>
            <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mt-3">
              Expires in: {Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:
              {(remainingSeconds % 60).toString().padStart(2, '0')}
            </div>

            <div className="mb-4 mt-6">
              <label className="block" htmlFor="code">
                <span className="block text-sm font-medium text-slate-700 mb-2">Verification Code</span>
                <input
                  type="text"
                  name="code"
                  id="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm text-center text-lg font-bold tracking-widest"
                  placeholder="000000"
                />
              </label>
            </div>

            <div className="modal-footer block sm:flex gap-3 pt-2 mt-4">
              {canResend ? (
                <button type="button" onClick={handleResend} className="py-2 w-full flex-1 bg-transparent text-black hover:bg-gray-100">
                  Resend Code
                </button>
              ) : (
                <button type="button" disabled className="py-2 w-full flex-1 bg-gray-200 text-gray-700 cursor-not-allowed">
                  Resend ({remainingSeconds}s)
                </button>
              )}
              <button
                  type="submit"
                  disabled={remainingSeconds <= 0 || verifying}
                  className={`py-2 w-full flex-1 ${
                    remainingSeconds <= 0 || verifying
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-amber-300 hover:bg-amber-400 text-black"
                  }`}
                >
                    {verifying ? "Verifying..." : "Verify Phone"}
                </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneVerifyModal;