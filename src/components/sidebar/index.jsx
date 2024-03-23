import "./styles.css";

const SideBar = ({ title, options, selected, switchSelected }) => {
  const handleSelected = (index) => {
    switchSelected(index);
  };

  return (
    <div className="sidebar">
      <div className="sidebar_title">{title}</div>
      <div className="sidebar_options">
        {options.map((option, index) => (
          <span
            className={
              "sidebar_option" + (index == selected ? " highlighted" : "")
            }
            onClick={() => handleSelected(index)}
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
