import { createRoot } from "react-dom/client";
import "./global.css";

// Pages
import { LoginCard } from "@/page/login/login";
import { StudentPage } from "@/page/student/page";
import { SubjectPage } from "@/page/subject/page";
import { SelectionPage } from "./page/selection/page";

// Components
import { FlexDiv } from "@/components/container";

// Plugins
import { createHashRouter, RouterProvider, Link } from "react-router-dom";
import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <FlexDiv className="flex-col gap-2">
        Hello world! With React Router!
        <Link to="/login" target="_blank">
          Login
        </Link>
        <Link to="/students">Students</Link>
        <Link to="/subjects">Subjects</Link>
        <Link to="/selections">Selections</Link>
      </FlexDiv>
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
  {
    path: "/students",
    element: <StudentPage></StudentPage>,
  },
  {
    path: "/subjects",
    element: <SubjectPage></SubjectPage>,
  },
  {
    path: "/selections",
    element: <SelectionPage></SelectionPage>,
  },
]);

const root = createRoot(document.body);
root.render(<RouterProvider router={router} />);
