// import React from "react";
// import HomePage from "./(public)/page";

// const page = () => {
//   return (
//     <>
//       <HomePage />
//     </>
//   );
// };

// export default page;

// //Initially, he used next redirect here cause the initial landing page was not ready
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}
