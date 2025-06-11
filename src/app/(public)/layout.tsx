import React from 'react';
// import Nav from "@/components/Layouts/NonAuthLayout/Nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Nav /> */}
      {children}
    </>
  );
}
