import React from "react";
import { navLinks } from "@/components/common/constants";

const Nav = () => {
  return (
    <div className="wrapper">
      <div className="flex items-center justify-between">
        <div className="font-bold text-[1.5rem]">Forlio</div>
        <ul className="flex gap-[20px]">
          {navLinks.map((link) => {
            const { name } = link;
            return (
              <li key={link.id} className="cursor-pointer">
                {name}
              </li>
            );
          })}
        </ul>

        <div className="sign-ups">
          <button>Sign Up</button>
          <button className="btn-gradient ml-[.5rem] rounded-[.2rem] text-white p-[.5rem]">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
