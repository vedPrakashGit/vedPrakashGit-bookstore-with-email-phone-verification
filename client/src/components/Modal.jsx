import { useEffect } from "react";
import ReactDOM from "react-dom";

const Modal = ({ showModalHandler, children }) => {
  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={showModalHandler}></div>
      <div className="modal-dialog max-w-xl mx-auto bg-white rounded-md overflow-hidden fixed p-4 w-full mob-position">
        {children}
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default Modal;
