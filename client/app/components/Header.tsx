"use client";

import React from "react";

const DesktopNotice = () => {
    return (
        <div className="fixed top-0 left-0 w-full  overflow-hidden z-50">
            <div className="whitespace-nowrap animate-scroll text-white gap-5 py-2 text-lg font-medium">
                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site &nbsp;&nbsp;&nbsp;&nbsp;


                Please view in desktop site
            </div>

            <style jsx>{`
        .animate-scroll {
          display: inline-block;
          padding-left: 100%;
          animation: scroll-left 15s linear infinite;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
};

export default DesktopNotice;