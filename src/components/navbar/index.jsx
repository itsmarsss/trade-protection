import { useEffect, useState } from "react";
import "./styles.css";
import BarItem from "../baritem";

const NavBar = ({ text, switchTabs }) => {
  const [letters, setLetters] = useState([]);
  const [baritems, setBarItems] = useState([]);

  useEffect(() => {
    const tempLetters = [];

    text.split("").forEach((letter) => {
      tempLetters.push(letter);
    });

    setLetters(tempLetters);

    setBarItems([
      {
        text: "Train",
        action: 0,
      },
      {
        text: "Test",
        action: 1,
      },
      {
        text: "Simulation",
        action: 2,
      },
    ]);
  }, [text, switchTabs]);

  return (
    <>
      <div className="navbar">
        <div className="title">
          {letters.map((letter, index) => (
            <span className="puff_letter" key={index}>
              {letter == " " ? <>&#x2022;</> : letter}
            </span>
          ))}
        </div>
        <div className="baritems">
          {baritems.map((baritem, index) => (
            <BarItem
              text={baritem.text}
              tabIndex={baritem.action}
              onClick={switchTabs}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
