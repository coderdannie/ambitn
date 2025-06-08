// import Nav from "@/components/Layouts/NonAuthLayout/Nav";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* <Nav /> */}
      {children}
    </div>
  );
}
