import React from "react";
import Nav from "../../components/Layouts/NonAuthLayout/Nav";
import Hero from "../../components/Layouts/NonAuthLayout/Hero";
import Frame from "@/components/Layouts/NonAuthLayout/Frame";
import Footer from "@/components/Layouts/NonAuthLayout/Footer";
const HomePage = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <Frame />
      <Footer />
    </div>
  );
};

export default HomePage;
