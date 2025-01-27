import "./styles.css";
import History from "../history";
import { useEffect, useRef, useState } from "react";
import { forArgs, againstArgs, allArgs, scenarios } from "../../data/arguments";
import { caseStudies } from "../../data/casestudies";

const Test = ({ mode }) => {
  const [value, setValue] = useState("");
  const [scenario, setScenario] = useState("");
  const [answer, setAnswer] = useState("");
  const [win, setWin] = useState(false);

  const [scenarioAnswers, setScenarioAnswers] = useState([]);
  const [args, setArgs] = useState(allArgs);
  const [alts, setAlts] = useState(forArgs.concat(againstArgs));

  const [event, setEvent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [eventArguments, setEventArguments] = useState([]);

  const [correct, setCorrect] = useState(0);
  const [attempt, setAttempt] = useState(0.00001);
  const [second, setSecond] = useState(0);
  const [history, setHistory] = useState([]);

  const inputRef = useRef(null);
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
    return (
      (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  const handleReset = () => {
    setSecond(0);
    setArgs(allArgs);
    setCorrect(0);
    setAttempt(0.00001);
    setWin(false);
    clearInterval(timerIdRef.current);

    if (mode == 1) {
      startTimer();
      const policy = scenarios[Math.floor(Math.random() * scenarios.length)];
      setScenario(
        policy.scenarios[Math.floor(Math.random() * policy.scenarios.length)]
      );

      for (let i = 0; i < alts.length; i++) {
        if (alts[i].main == policy.answer) {
          const updatedAlts = [...alts[i].alt];
          updatedAlts.push(alts[i].main);
          setAnswer(alts[i].main);
          setScenarioAnswers(updatedAlts);
        }
      }
    } else if (mode == 2) {
      startTimer();

      const caseStudy =
        caseStudies[Math.floor(Math.random() * caseStudies.length)];

      setEvent(caseStudy.case);
      setExplanation(caseStudy.explanation);
      setEventArguments(caseStudy.arguments);
    }
  };

  const handleQuestion = () => {
    if (win) {
      return;
    }
    setWin(true);
    setArgs([]);
    const updatedHistory = [
      ...history,
      {
        mode: mode == 0 ? "Memory" : mode == 1 ? "Identify" : "Case Study",
        second: second,
        correct: correct,
        attempt: attempt,
      },
    ];
    setHistory(updatedHistory);
    setWin(true);
    clearInterval(timerIdRef.current);
  };

  const startTimer = () => {
    timerIdRef.current = setInterval(() => {
      setSecond((second) => second + 1);
    }, 1000);
  };

  const handleEnter = (e) => {
    if (win) {
      return;
    }

    if (value.trim() == "") {
      inputRef.current.focus();
      return;
    }

    let sim = 0;
    let title = "N/A";

    setAttempt(attempt + 1);

    const doSearch = (val1, val2, original) => {
      const tempSim = similarity(val1, val2);
      if (tempSim > sim) {
        sim = tempSim;
        title = original;
      }
    };

    if (mode == 0) {
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

        if (updatedArgs.length == 0) {
          const updatedHistory = [
            ...history,
            {
              mode: "Memory",
              second: second,
              correct: correct + 1,
              attempt: attempt + 1,
            },
          ];
          setHistory(updatedHistory);
          setWin(true);

          clearInterval(timerIdRef.current);
        }
      }

      if (attempt == 0.00001) {
        startTimer();
      }
    } else if (mode == 1) {
      scenarioAnswers.forEach((answer) => {
        doSearch(value, answer, scenarioAnswers[scenarioAnswers.length - 1]);
      });

      const index = args.indexOf(title);

      if (sim >= 0.7 && index !== -1) {
        setCorrect(correct + 1);

        const updatedHistory = [
          ...history,
          {
            mode: "Identify",
            second: second,
            correct: correct + 1,
            attempt: attempt + 1,
          },
        ];
        setHistory(updatedHistory);
        setWin(true);

        clearInterval(timerIdRef.current);
      }
    } else if (mode == 2) {
      setCorrect(correct + 1);

      const updatedHistory = [
        ...history,
        {
          mode: "Case Study",
          second: second,
          correct: correct + 1,
          attempt: attempt + 1,
        },
      ];
      setHistory(updatedHistory);
      setWin(true);

      clearInterval(timerIdRef.current);
    }

    e.value = "";
  };

  useEffect(() => {
    handleReset();
  }, [mode]);

  return (
    <>
      <div className="test_title">
        {mode == 0 ? (
          <>
            Memory{" "}
            <span className="small">
              (List out all the arguments you remember)
            </span>
          </>
        ) : mode == 1 ? (
          <>
            Identify{" "}
            <span className="small">
              (Identify the argument that applies to the scenario)
            </span>
          </>
        ) : (
          <>
            Case Study{" "}
            <span className="small">
              (Free response discussion of a real world case with context)
            </span>
          </>
        )}
      </div>
      {mode == 0 ? (
        <>
          <div className="test_arguments">
            <div className="test_arguments_for">
              <ul>
                <span className="test_arguments_title">For</span>
                {forArgs.map((forArg, index) => (
                  <li
                    className={args.includes(forArg.main) ? "" : "correct"}
                    key={index}
                  >
                    {forArg.main}
                  </li>
                ))}
              </ul>
            </div>
            <div className="test_arguments_against">
              <ul>
                <span className="test_arguments_title">Against</span>
                {againstArgs.map((againstArg, index) => (
                  <li
                    className={args.includes(againstArg.main) ? "" : "correct"}
                    key={index}
                  >
                    {againstArg.main}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : mode == 1 ? (
        <>
          <div className="test_scenario">
            <span>
              <b>Scenario:</b> {scenario}
            </span>
            <br />
            <br />
            <span>
              <b>Answer for scenario:</b>{" "}
              <span
                className={"test_scenario_answer" + (win ? " correct" : "")}
              >
                {answer}
              </span>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="test_casestudy">
            <span className="test_casestudy_event">
              <b>Case:</b> {event}
            </span>
            <span className="test_casestudy_explanation">
              <b>Context:</b> {explanation}
            </span>
            <span className="test_casestudy_arguments">
              <b>Possible Talking Points (reveal after you answer):</b>
              <ul>
                {eventArguments.map((eventArgument, index) => (
                  <li key={index} className={win ? "correct" : ""}>
                    {eventArgument}
                  </li>
                ))}
              </ul>
            </span>
          </div>
        </>
      )}
      <div className="test_panel">
        <div className="test_panel_input">
          <input
            ref={inputRef}
            className="test_panel_guess"
            placeholder="Type answer..."
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
            type="button"
            value="&#8594;"
            onClick={() => handleEnter(inputRef.current)}
          />
          <input
            className="test_panel_restart"
            type="button"
            value="&#8634;"
            onClick={handleReset}
          />
          <input
            className="test_panel_question"
            type="button"
            value="?"
            onClick={handleQuestion}
          />
        </div>
        <div className="test_panel_stats">
          <span>
            Time: {Math.floor(second / 60)}:
            {String(second % 60).padStart(2, "0")}
          </span>
          <span>
            Attempts: {correct}/{attempt.toFixed(0)} (
            {((correct * 100) / attempt).toFixed(2)}%)
          </span>
        </div>
      </div>
      <History history={history} clearHistory={() => setHistory([])} />
    </>
  );
};

export default Test;
