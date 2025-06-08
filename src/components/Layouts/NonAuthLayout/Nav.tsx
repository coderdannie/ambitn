import React from "react";
import { navLinks } from "@/components/common/constants";
import { GiHamburgerMenu } from "react-icons/gi";

const Nav = ({ handleClickOpen }) => {
  return (
    <div className="wrapper">
      <div className="flex items-center justify-between">
        <div className="hide-logo" onClick={handleClickOpen}>
          <GiHamburgerMenu />
        </div>
        <div className="font-bold text-[1.5rem]">Forlio</div>
        <ul className="flex hide gap-[20px] nav-list">
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
