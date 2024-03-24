import { useEffect, useRef, useState } from "react";
import "./styles.css";

const Message = ({ role, message }) => {
  const [showState, setShowState] = useState(true);

  const messageRef = useRef(null);

  const handleChangeView = () => {
    if (messageRef.current) {
      messageRef.current.style.filter = "blur(5px)";
    }

    setTimeout(() => {
      setShowState(!showState);
    }, 25);

    if (messageRef.current) {
      setTimeout(() => {
        messageRef.current.style.filter = "blur(0px)";
      }, 50);
    }
  };

  return (
    <>
      {role != "system" && (
        <div className="message">
          {role == "assistant" ? (
            <>
              <div className="message_ai">
                <span className="message_ai_decision">
                  {message.oppDecision || <i>No Data</i>}
                </span>
                <div className="message_ai_motivation">
                  <div className="tooltip">
                    <b>
                      <u>Motivation:</u>
                    </b>{" "}
                    {message.oppMotivation || <i>No Data</i>}
                  </div>
                  <span>
                    <b>
                      <u>Motivation:</u>
                    </b>{" "}
                    {message.oppMotivation || <i>No Data</i>}
                  </span>
                </div>
              </div>
              <div className="message_game" ref={messageRef}>
                {message.hasArgument ? (
                  <>
                    {showState ? (
                      <div className="message_game_state">
                        {message.gameState}
                      </div>
                    ) : (
                      <div className={"message_game_argument"}>
                        <div>
                          <b>{message.argument}</b>
                        </div>
                        <div>{message.argExplanation}</div>
                      </div>
                    )}
                    <input
                      className="message_game_toggle"
                      type="button"
                      value={
                        showState ? "Show Relevant Argument" : "Show Game State"
                      }
                      onClick={handleChangeView}
                    ></input>
                  </>
                ) : (
                  <div className="message_game_state">{message.gameState}</div>
                )}
              </div>
            </>
          ) : (
            <span>&gt; {message}</span>
          )}
        </div>
      )}
    </>
  );
};

export default Message;
