import React from "react";
import Image from "next/image";

import {
  companyLinks,
  legalLinks,
  navLinks,
  productLinks,
  resourcesLinks,
  socialIcons,
  socialLinks,
} from "@/components/common/constants";
import { Images } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-black">
      <div className="wrapper mt-[5rem]">
        <div className="mx-auto mobi-place-center md:flex items-center justify-between">
          <div>
            <Image
              src="/assets/logo-icon-footer.png"
              alt="footer-logo"
              width={100}
              height={100}
            />
          </div>
          <div className="footer-navs text-[10px] md:flex items-center bottom-mobi text-center leading-[2] gap-[10px]">
            {navLinks.map((link) => {
              const { name } = link;
              return (
                <div className="text-white cursor-pointer" key={link.id}>
                  {name}
                </div>
              );
            })}
            <div className="cursor-pointer">
              <a href="/support" className="text-white">
                Support
              </a>
            </div>
          </div>

          <div className="footer-social-icons flex items-center text-center screen-mobi gap-[10px]">
            {socialIcons.map((icon, i) => {
              return (
                <div key={i}>
                  <Image src={icon} alt="icon" width={15} height={15} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;

{
  /* <div className="footer-signup-box  sign-up-gradient p-[2.5rem] bg-[#F9FAFB] desktop-width mx-auto md:flex items-center rounded-[1rem] justify-between transform translate-y-[-70px]">
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
              <div className="">
                <div className="logo-box mobi-center flex items-center gap-[1px]">
                  <Image
                    src="/assets/Logomark.png"
                    alt="logo"
                    width={20}
                    height={20}
                  />
                  <h3 className="ml-[.3rem]">Powerbank</h3>
                </div>
                <p className="md:mt-[2rem] bottom-mobi screen-mobi text-[#D0D5DD] text-[.7rem] w-[35ch]">
                  Design amazing digital experiences that create more happy in
                  the world
                </p>
              </div>

              <div className="product">
                {productLinks.map((link) => {
                  return (
                    <div
                      key={link.id}
                      className="first:text-[#D0D5DD] screen-mobi text-[.7rem] text-[#EAECF0] leading-[2]"
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
                      className="first:text-[#D0D5DD] screen-mobi text-[.7rem] text-[#EAECF0] leading-[2]"
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
                      className="first:text-[#D0D5DD] screen-mobi text-[.7rem] text-[#EAECF0] leading-[2]"
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
                      className="first:text-[#D0D5DD] screen-mobi text-[.7rem] text-[#EAECF0] leading-[2]"
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
                      className="first:text-[#D0D5DD] screen-mobi text-[.7rem] text-[#EAECF0] leading-[2]"
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
        </div> */
}
