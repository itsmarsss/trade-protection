import "./styles.css";
import History from "../history";
import { useEffect, useRef, useState } from "react";

const Test = ({mode}) => {
  const [value, setValue] = useState("");
  const [args, setArgs] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [attempt, setAttempt] = useState(0.00001);
  const [second, setSecond] = useState(0);
  const [history, setHistory] = useState([]);
  const timerIdRef = useRef(null);

  const forArgs = [
    "Protection of infant (sunrise) industries",
    "National security",
    "Maintenance of health and safety",
    "Environmental standard",
    "Anti-dumping",
    "Unfair competition",
    "Balance-of-payments correction",
    "Sources of government revenue",
    "Protection of jobs",
    "Economically least developed country (ELDC) diversification"
  ];

  const againstArgs = [
    "Misallocation of resources",
    "Retaliation",
    "Increased costs",
    "Higher prices",
    "Less choice",
    "Lack of incentive for domestic firms to become more efficient",
    "Reduced export competitiveness"
  ];

  useEffect(() => {
    setArgs(forArgs.concat(againstArgs));
  }, []);

  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  const handleReset = () => {
    setSecond(0);
    setArgs(forArgs.concat(againstArgs));
    setCorrect(0);
    setAttempt(0.00001);
  }

  const handleEnter = () => {
    let sim = 0;
    let index = -1;
  
    args.forEach((arg, idx) => {
      const tempSim = similarity(value, arg);
      if (tempSim > sim) {
        sim = tempSim;
        index = idx;
      }
    });
  
    if (sim >= 0.7) {
      const updatedArgs = [...args];
      updatedArgs.splice(index, 1);
  
      setArgs(updatedArgs);
  
      setCorrect(correct + 1);
    }
  
    if (attempt === 0.00001) {
      timerIdRef.current = setInterval(() => {
        setSecond(second => second + 1);
      }, 1000);
    }

    setAttempt(attempt + 1);

    if(args.length === 16) {
      const updatedHistory = [...history, {
        mode: "Memory",
        second: second,
        correct: correct,
        attempt: attempt
      }];
      setHistory(updatedHistory);
      
      clearInterval(timerIdRef.current);
    }
  
  };

  useEffect(() => {
    handleReset();
  }, [mode]);

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
              {forArgs.map((forArg, index) => (
                <li
                  className={args.includes(forArg) ? "" : "correct"}
                  key={index}>{forArg}</li>
              ))}
            </ul>
          </div>
          <div className="test_arguments_against">
            <ul>
              <span className="test_arguments_title">Against</span>
              {againstArgs.map((againstArg, index) => (
                <li
                  className={args.includes(againstArg) ? "" : "correct"}
                  key={index}>{againstArg}</li>
              ))}
            </ul>
          </div>
        </div>
      </>)}
      <div className="test_panel">
        <div className="test_panel_input">
          <input 
            className="test_panel_guess"
            type="text"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if(e.key == "Enter") {
                handleEnter();
                e.target.value = "";
              }
            }}
          />
          <input
            className="test_panel_go"
            type="button" value="&#8594;"
            onClick={handleEnter}
          />
          <input
            className="test_panel_restart"
            type="button" value="&#8634;"
            onClick={handleReset}
          />
        </div>
        <div className="test_panel_stats">
          <span>Time: {Math.floor(second / 60)}:{String(second % 60).padStart(2, "0")}</span>
          <span>Attempts: {correct}/{attempt.toFixed(0)} ({(correct*100/attempt).toFixed(2)}%)</span>
        </div>
      </div>
      <History history={history}/>
    </>
  );
};

export default Test;
