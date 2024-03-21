import "./styles.css";
import History from "../history";
import { useEffect, useRef, useState } from "react";
import { forArgs, againstArgs, allArgs, scenarios } from "../../data/arguments"

const Test = ({ mode }) => {
  const [value, setValue] = useState("");
  const [scenario, setScenario] = useState("");
  const [scenarioAnswers, setScenarioAnswers] = useState([]);
  const [args, setArgs] = useState(allArgs);
  const [alts, setAlts] = useState(forArgs.concat(againstArgs));
  const [correct, setCorrect] = useState(0);
  const [attempt, setAttempt] = useState(0.00001);
  const [second, setSecond] = useState(0);
  const [history, setHistory] = useState([]);
  const timerIdRef = useRef(null);

  useEffect(() => {
    setArgs(allArgs);
    setAlts(forArgs.concat(againstArgs));
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
    setArgs(allArgs);
    setCorrect(0);
    setAttempt(0.00001);
    clearInterval(timerIdRef.current);

    if (mode === 1) {
      startTimer();
      const policy = scenarios[Math.floor(Math.random() * scenarios.length)];
      setScenario(policy.scenarios[Math.floor(Math.random() * policy.scenarios.length)]);
      for (let i = 0; i < alts.length; i++) {
        if (alts[i].main === policy.answer) {
          const updatedAlts = [...alts[i].alt];
          updatedAlts.push(alts[i].main);
          setScenarioAnswers(updatedAlts);
        }
      }
    }
  }

  const startTimer = () => {
    timerIdRef.current = setInterval(() => {
      setSecond(second => second + 1);
    }, 1000);
  }

  const handleEnter = (e) => {
    let sim = 0;
    let title = "N/A";

    const doSearch = (val1, val2, original) => {
      const tempSim = similarity(val1, val2);
      if (tempSim > sim) {
        sim = tempSim;
        title = original;
      }
    };

    if (mode === 0) {
      alts.forEach((alts) => {
        doSearch(value, alts.main, alts.main);
        alts.alt.forEach((alt) => {
          doSearch(value, alt, alts.main);
        });
      });

      const index = args.indexOf(title);
      if (sim >= 0.7 && index !== -1) {
        const updatedArgs = [...args];
        updatedArgs.splice(index, 1);

        setArgs(updatedArgs);

        setCorrect(correct + 1);
      }

      if (attempt === 0.00001) {
        startTimer();
      }

      setAttempt(attempt + 1);

      if (args.length === 0) {
        const updatedHistory = [...history, {
          mode: "Memory",
          second: second,
          correct: correct,
          attempt: attempt
        }];
        setHistory(updatedHistory);

        clearInterval(timerIdRef.current);
      }
    } else {
      scenarioAnswers.forEach((answer) => {
        doSearch(value, answer, scenarioAnswers[scenarioAnswers.length - 1]);
      });

      const index = args.indexOf(title);

      console.log(value, title, sim, index)

      if (sim >= 0.7 && index !== -1) {
        setCorrect(correct + 1);

        const updatedHistory = [...history, {
          mode: "Identify",
          second: second,
          correct: correct,
          attempt: attempt
        }];
        setHistory(updatedHistory);

        clearInterval(timerIdRef.current);
      }

      setAttempt(attempt + 1);
    }

    e.value = "";
  };

  useEffect(() => {
    handleReset();
  }, [mode]);

  return (
    <>
      <div className="test_title">{mode == 0 ? "Memory" : "Identify"}</div>
      {mode == 1 ?
        (<>
          <div className="test_scenario">
            <span><b>Argument for scenario:</b></span>{" "}
            <span className="test_scenario_text">{scenario}</span>
          </div>
        </>) :
        (<>
          <div className="test_arguments">
            <div className="test_arguments_for">
              <ul>
                <span className="test_arguments_title">For</span>
                {forArgs.map((forArg, index) => (
                  <li
                    className={args.includes(forArg.main) ? "" : "correct"}
                    key={index}>{forArg.main}</li>
                ))}
              </ul>
            </div>
            <div className="test_arguments_against">
              <ul>
                <span className="test_arguments_title">Against</span>
                {againstArgs.map((againstArg, index) => (
                  <li
                    className={args.includes(againstArg.main) ? "" : "correct"}
                    key={index}>{againstArg.main}</li>
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
              if (e.key == "Enter") {
                handleEnter(e.target);
              }
            }}
          />
          <input
            className="test_panel_go"
            type="button" value="&#8594;"
            onClick={(e) => handleEnter(e.target.previousSibling)}
          />
          <input
            className="test_panel_restart"
            type="button" value="&#8634;"
            onClick={handleReset}
          />
        </div>
        <div className="test_panel_stats">
          <span>Time: {Math.floor(second / 60)}:{String(second % 60).padStart(2, "0")}</span>
          <span>Attempts: {correct}/{attempt.toFixed(0)} ({(correct * 100 / attempt).toFixed(2)}%)</span>
        </div>
      </div>
      <History
        history={history}
        clearHistory={() => setHistory([])}
      />
    </>
  );
};

export default Test;
