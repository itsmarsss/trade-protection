import "./styles.css";
import History from "../history";

const Test = ({mode}) => {
  return (
    <>
      <div className="test_title">{mode == 0 ? "Memory" : "Identify"}</div>
      {mode == 1 ? 
      (<>
        <div className="test_scenario"></div>
      </>) :
      (<>
        <div className="test_arguments">
          <div className="test_arguments_for">
            <ul>
              <span className="test_arguments_title">For</span>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
            </ul>
          </div>
          <div className="test_arguments_against">
            <ul>
              <span className="test_arguments_title">Against</span>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
              <li>ABCDEF</li>
            </ul>
          </div>
        </div>
      </>)}
      <div className="test_panel">
        <div className="test_panel_input">
          <input className="test_panel_guess" type="text"/>
          <input className="test_panel_go" type="button" value="&#8594;"/>
        </div>
        <div className="test_panel_stats">
          <span>Time: 0:00</span>
          <span>Attempts: 0/0</span>
        </div>
      </div>
      <History/>
    </>
  );
};

export default Test;
