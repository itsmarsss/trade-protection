import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import SideBar from "./components/sidebar";
import Train from "./components/train";
import Test from "./components/test";
import Simulation from "./components/simulation";
import PageMap from "./components/pagemap";
import CursorFollower from "./components/cursorfollower";

const App = () => {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState(0);
  const [prevX, setPrevX] = useState(0);
  const [slide, setSlide] = useState(false);

  const addedRef = useRef(false);
  const sideBarRef = useRef(null);

  const switchTab = (index) => {
    setTab(index);
    handleSelected(0);
  };

  const handleSelected = (index) => {
    setSelected(index);
    setSlide(true);
    setTimeout(() => {
      setSlide(false);
    }, 200);
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
    { title: "Mode", options: ["Memory", "Identify", "Case Study"] },
    { title: "Trade Simulator", options: ["Simulate"] },
  ];

  useEffect(() => {
    if (addedRef.current) {
      return;
    }

    addedRef.current = true;
    document.addEventListener("mousemove", (e) => {
      if (e.y + window.scrollY > 250) {
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

        puffer.style.transition = size == 0.5 ? "100ms" : "0ms";
        puffer.style.transform = `scale(${size})`;
      });
    });

    setInterval(() => {
      if (sideBarRef.current) {
        sideBarRef.current.style.transform = `translateY(${Math.max(
          window.scrollY - 250,
          0
        )}px)`;
      }
    }, 50);
  }, []);

  const contentRef = React.createRef();
  const pageMapOptions = {
    selector: {
      "h1,a,.baritem,.sidebar_title,.test_title": "#ffffffcc",
      "h2,h3,h4,span,li,cursor": "#ffffff99",
      "header,footer,section,article,input,p": "#ffffff33",
      div: "#ffffff05",
    },
    width: 100,
    height: 100,
    background: "#0000000",
    drag: "#000000aa",
    viewport: "#00000066",
  };

  return (
    <>
      <div className="app" ref={contentRef}>
        <NavBar text={"TRADE PROTECTION"} switchTabs={switchTab} />
        <SideBar
          reference={sideBarRef}
          title={tabs[tab].title}
          options={tabs[tab].options}
          selected={selected}
          switchSelected={handleSelected}
        />
        <div className={"content" + (slide ? " slide" : "")}>
          {tab == 0 ? (
            <Train page={selected} />
          ) : tab == 1 ? (
            <Test mode={selected} />
          ) : (
            <Simulation />
          )}
        </div>
        <PageMap container={contentRef} options={pageMapOptions} />
        <CursorFollower />
      </div>
    </>
  );
};

export default App;
