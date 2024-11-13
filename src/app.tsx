import { createRoot } from "react-dom/client";
import "./global.css";

const root = createRoot(document.body);
root.render(
  <h2 className="text-blue font-mono font-bold">Hello from React!</h2>,
);
