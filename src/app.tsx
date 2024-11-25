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
import { classNames } from "./tools/css_tools";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <FlexDiv
        expand
        className={classNames(
          "h-screen w-screen flex-none flex-col items-center justify-center gap-2 bg-blue-100",
        )}
      >
        <h1 className="text-2xl font-bold">欢迎来到学生选课管理系统！</h1>
        <Link to="/login" target="_blank">
          登录页面
        </Link>
        <Link to="/students">管理学生信息</Link>
        <Link to="/subjects">管理课程信息</Link>
        <Link to="/selections">管理学生选课信息</Link>
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
