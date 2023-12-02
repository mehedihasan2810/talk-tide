import Footer from "@/components/Home/Footer";
import Navbar from "@/components/Home/Navbar";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Talk Tide | Home",
  description: "This is the home page of talk tide website",
};

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default HomeLayout;
