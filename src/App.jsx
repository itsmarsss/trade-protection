import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";

function App() {
  const [tab, setTab] = useState(0);
  const [prevX, setPrevX] = useState(0);

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

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      if (e.y > 250) {
        const puffers = document.getElementsByClassName("puff_letter");
        Array.from(puffers).forEach((puffer) => {
          puffer.style.transition = "100ms";
          puffer.style.transform = "scale(1)";
        });
        return;
      }

      if (Math.abs(e.x - prevX) < 100) {
        return;
      }

      setPrevX(e.x);

      const puffers = document.getElementsByClassName("puff_letter");
      Array.from(puffers).forEach((puffer) => {
        const puffer_left = puffer.offsetLeft + puffer.offsetWidth / 2;
        const dist = Math.abs(e.x - puffer_left);
        const size = Math.max(Math.min(100 / dist, 1), 0.5);
        puffer.style.transition = "0ms";
        puffer.style.transform = `scale(${size})`;
      });
    });
  }, []);

  return (
    <>
      <NavBar text={"TRADE PROTECTION"} switchTabs={switchTab} />
      <SideBar title={tabs[tab].title} options={tabs[tab].options} />
    </>
  );
}

export default App;
