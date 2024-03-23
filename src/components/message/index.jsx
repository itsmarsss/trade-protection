import "./styles.css";

const Message = ({ role, message }) => {
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
              <div className="simulation_game_state">{message.gameState}</div>
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
