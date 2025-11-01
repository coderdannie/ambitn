"use client";
import Footer from "@/components/Layouts/NonAuthLayout/Footer";
import Hero from "@/components/Layouts/NonAuthLayout/Hero";
import MobiDropDown from "@/components/Layouts/NonAuthLayout/MobiDropDown";
import Nav from "@/components/Layouts/NonAuthLayout/Nav";
import Frame from "@/components/Layouts/NonAuthLayout/Frame";
import { useState } from "react";
import LoginModal from "@/components/Layouts/NonAuthLayout/LoginModal";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showScreenModal, setShowScreenModal] = useState(false);
  const handleClickOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleShowModal = () => {
    setShowModal(true);
    console.log("hovered");
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowScreenModal = () => {
    setShowScreenModal(true);
  };
  return (
    <div>
      <Nav
        handleClickOpen={handleClickOpen}
        handleShowModal={handleShowModal}
        showModal={showModal}
        setShowModal={setShowModal}
        handleCloseModal={handleCloseModal}
        handleShowScreenModal={handleShowScreenModal}
      />
      <MobiDropDown setIsOpen={setIsOpen} isOpen={isOpen} />
      <Hero />
      <Frame
        setShowModal={setShowModal}
        showModal={showModal}
        showScreenModal={showScreenModal}
        setShowScreenModal={setShowScreenModal}
      />
      <Footer />
    </div>
  );
};
export default HomePage;
