import { useEffect, useState } from "react";
import "./styles.css";

const SideBar = ({ title, options }) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [options]);

  return (
    <div className="sidebar">
      <div className="sidebar_title">{title}</div>
      <div className="sidebar_options">
        {options.map((option, index) => (
          <span
            className={
              "sidebar_option" + (index == selected ? " highlighted" : "")
            }
            onClick={() => setSelected(index)}
            key={index}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
