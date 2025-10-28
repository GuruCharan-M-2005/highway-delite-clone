import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Attempted access to non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="mb-4 text-6xl font-bold text-destructive">404</h1>
      <p className="mb-4 text-lg text-muted-foreground">
        Oops! The page <span className="font-mono">{location.pathname}</span> could not be found.
      </p>

      <Link
        to="/"
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;



// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";

// const NotFound = () => {
//   const location = useLocation();

//   useEffect(() => {
//     console.error("404 Error: User attempted to access non-existent route:", location.pathname);
//   }, [location.pathname]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="text-center">
//         <h1 className="mb-4 text-4xl font-bold">404</h1>
//         <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
//         <a href="/" className="text-blue-500 underline hover:text-blue-700">
//           Return to Home
//         </a>
//       </div>
//     </div>
//   );
// };

// export default NotFound;
