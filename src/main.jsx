import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import PageMap from "./components/pagemap";

const contentRef = React.createRef();
const pageMapOptions = {
  selector: {
    "h1,a": "#ffffffcc",
    "h2,h3,h4": "#ffffff66",
    "header,footer,section,article": "#ffffff1a",
    div: "#ffffff1a",
  },
  width: 50,
  height: 200,
  background: "#ffffff33",
  drag: "#00000033",
  viewport: "#000000aa",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App ref={contentRef} />
    <PageMap container={contentRef} options={pageMapOptions} />
  </React.StrictMode>
);
