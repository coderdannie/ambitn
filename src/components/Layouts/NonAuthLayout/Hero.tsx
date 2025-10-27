import React from "react";
import heroImg1 from "../../../../public/assets/hero-image1.svg";
import heroImg2 from "../../../../public/assets/hero-img2.svg";
import Image from "next/image";
const Hero = () => {
  return (
    <>
      <div className="wrapper transform translate-y-[15%]">
        <div className="flex justify-center">
          <Image
            src="/assets/hero-image1.svg"
            alt="hero icon"
            width={180}
            height={180}
            className="hide slide-in-left"
          />
          <div className="hero-content fade-in-up">
            <h1 className="btn-text-gradient font-text mx-auto leading-none font-bold text-[4rem] text-center">
              Top Creators from Around the Globe Showcase on Forlio
            </h1>
            <p className="mx-auto text-center my-[1rem]">
              Discover groundbreaking projects and connect with talented
              creatives from every corner of the world. Join the vibrant
              community where innovation and inspiration come to life.
            </p>
            <button className="btn-gradient text-[14px] px-[2rem] text-white mx-auto flex btn-gradient rounded-[.3rem]  p-[.7rem]">
              Hire a freelancer
            </button>
          </div>
          <Image
            src="/assets/hero-image3.svg"
            alt="hero icon"
            width={180}
            height={180}
            className="hide slide-in-right"
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
