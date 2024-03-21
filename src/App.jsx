import { useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";

function App() {
  const [tab, setTab] = useState(0);

  const switchTab = (index) => {
    setTab(index);
  };

  const tabs = [
    {
      title: "Table of Content",
      options: [
        "Arguments for trade protection",
        "Arguments against trade protection",
        "Free trade versus trade protection",
      ],
    },
    { title: "Mode", options: ["Identify", "Memory"] },
    { title: "Statistics", options: ["Money", "Goods"] },
  ];

  return (
    <>
      <NavBar text={"TRADE PROTECTION"} switchTabs={switchTab} />
      <SideBar title={tabs[tab].title} options={tabs[tab].options} />
    </>
  );
}

export default App;
