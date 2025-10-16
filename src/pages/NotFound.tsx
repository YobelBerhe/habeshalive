import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="mb-4 text-6xl md:text-8xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl md:text-2xl text-muted-foreground px-4">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
