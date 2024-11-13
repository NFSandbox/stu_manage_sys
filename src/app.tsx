import { createRoot } from "react-dom/client";
import "./global.css";

// Pages
import { LoginCard } from "@/page/login/login";

// Plugins
import { createHashRouter, RouterProvider, Link } from "react-router-dom";
import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <div>
        Hello world! With React Router!
        <Link to="/login" target="_blank">
          Login
        </Link>
      </div>
    ),
  },
  {
    path: "/login",
    element: <LoginCard />,
  },
  {
    path: "/home",
    element: <p>Home</p>,
  },
]);

const root = createRoot(document.body);
root.render(<RouterProvider router={router} />);
