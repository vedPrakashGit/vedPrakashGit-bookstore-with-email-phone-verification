import React from "react";
import { RiUser2Fill } from "react-icons/ri";
import PhoneVerifyModal from "./PhoneVerifyModal";
import Modal from "./Modal";

const UserDetails = ({ user }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="text-center py-10 max-w-lg mx-auto border border-amber-300 px-5 rounded-md mt-10 mb-12 text-white">
        <RiUser2Fill className="text-8xl mx-auto" />
        <h3 className="font-bold text-4xl mt-3 mb-4 border-b-2 border-b-slate-600 pb-3">
          {user && user.name}
        </h3>
        <p className="text-2xl mb-2">Email: {user && user.email}</p>
        <p className="text-2xl">
          User Type: {user && user.isAdmin == true ? "Admin" : "Normal"}
        </p>
        {user && user.isPhoneVerified && (
          <p className="text-2xl mt-2">Phone: {user.phone}</p>
        )}
        <button 
          onClick={() => setShowModal(true)}
          disabled={user && user.isPhoneVerified}
          className="mt-6 px-6 py-2 bg-amber-300 text-black font-bold rounded-md hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Phone Number
        </button>
      </div>
      {showModal && <Modal><PhoneVerifyModal onClose={() => setShowModal(false)} /></Modal>}
    </>
  );
};

export default UserDetails;
