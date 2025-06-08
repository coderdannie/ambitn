import React from "react";
import Image from "next/image";
import {
  companyLinks,
  legalLinks,
  productLinks,
  resourcesLinks,
  socialIcons,
  socialLinks,
} from "@/components/common/constants";

const Footer = () => {
  return (
    <div className="">
      <div className="mt-[5rem] bg-black">
        <div className="footer-signup-box  sign-up-gradient p-[2.5rem] bg-[#F9FAFB] desktop-width mx-auto md:flex items-center rounded-[1rem] justify-between transform translate-y-[-70px]">
          <div>
            <h3 className="font-bold text-[#101828] text-[1.5rem]">
              Sign up to meet the world greatest
            </h3>
            <p className="text-[#475467] text-[.8rem] mt-[.5rem]">
              Join over 4,000+ startups already growing with Untitled
            </p>
          </div>
          <div className="mobile-margin-top">
            <button className="border-[#D0D5DD] border-[1px] text-[.8rem] rounded-[.3rem] p-[.4rem]">
              Learn more
            </button>
            <button className="btn-gradient p-[.4rem] rounded-[.3rem] ml-[.5rem] text-[.8rem] text-white">
              Get started
            </button>
          </div>
        </div>

        <div className="btn-gradient p-[1.2rem]">
          <div className="wrapper">
            <div className="md:flex text-white justify-between gap-[40px]">
              <div>
                <div className="logo-box flex items-center gap-[1px]">
                  <Image
                    src="/assets/Logomark.png"
                    alt="logo"
                    width={20}
                    height={20}
                  />
                  <h3 className="ml-[.3rem]">Powerbank</h3>
                </div>
                <p className="mt-[2rem] text-[#D0D5DD] text-[.7rem] w-[35ch]">
                  Design amazing digital experiences that create more happy in
                  the world
                </p>
              </div>

              <div className="product ">
                {productLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] text-[.9rem] text-[#EAECF0] leading-[2]"
                    >
                      {link.name}
                    </div>
                  );
                })}
              </div>
              <div className="company">
                {companyLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] text-[.9rem] text-[#EAECF0] leading-[2]"
                    >
                      {link.name}
                    </div>
                  );
                })}
              </div>
              <div className="resources">
                {resourcesLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] text-[.9rem] text-[#EAECF0] leading-[2]"
                    >
                      {link.name}
                    </div>
                  );
                })}
              </div>
              <div className="social">
                {socialLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] text-[.9rem] text-[#EAECF0] leading-[2]"
                    >
                      {link.name}
                    </div>
                  );
                })}
              </div>
              <div className="legal">
                {legalLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] text-[.9rem] text-[#EAECF0] leading-[2]"
                    >
                      {link.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="social-icons-box mt-[4rem] flex items-center justify-between">
              <p className="text-white text-[.7rem]">
                © 2077 Untitled UI. All rights reserved.
              </p>
              <div className="social-icons flex items-center gap-[10px]">
                {socialIcons.map((icon, i) => {
                  return (
                    <div key={i}>
                      <Image
                        src={icon}
                        alt="social icons"
                        width={15}
                        height={15}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
