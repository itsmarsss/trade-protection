import "./styles.css";

const BarItem = ({ text, tabIndex, onClick }) => {
  return (
    <div className="baritem" onClick={() => onClick(tabIndex)}>
      {text}
    </div>
  );
};

export default BarItem;
