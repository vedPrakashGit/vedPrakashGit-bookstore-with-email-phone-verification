import React from "react";
import moment from "moment";

const Footer = () => {
  return (
    <div className="pt-5 px-3">
      <hr className="border-slate-500" />
      <p className="text-xs text-stone-300 text-center py-2">
        &copy; Copyright {moment().format("YYYY")}. BookStore. Designed and
        Created by Ved Prakash. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
