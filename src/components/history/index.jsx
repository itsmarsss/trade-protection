import "./styles.css";

const History = ({history, clearHistory}) => {
  return (
    <>
      <div className="history">
        <div className="history_title">History</div>
          <div className="history_entries">
            <div className="history_entry">
              <span><b>Mode:</b></span>
              <span><b>Time:</b></span>
              <span><b>Score:</b></span>
            </div>
            {Array.from(history).toReversed().map((entry, index) => (
                <div className="history_entry" key={index}>
                <span>{entry.mode}</span>
                    <span>{Math.floor(entry.second / 60)}:{String(entry.second % 60).padStart(2, "0")}</span>
                    <span>{entry.correct}/{entry.attempt.toFixed(0)} ({(entry.correct*100/entry.attempt).toFixed(2)}%)</span>
                </div>
            ))}
            <input
              className="history_clear"
              type="button" value="Clear"
              onClick={clearHistory}
            />
          </div>
      </div>
    </>
  );
};

export default History;