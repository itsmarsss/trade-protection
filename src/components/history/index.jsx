import "./styles.css";

const History = ({history}) => {
  return (
    <>
      <div className="history">
        <div className="history_title">History</div>
        {Array.from(history).toReversed().map((entry, index) => (
            <div className="history_entry" key={index}>
                <span>Mode: {entry.mode}</span>
                <span>Time: {Math.floor(entry.second / 60)}:{String(entry.second % 60).padStart(2, "0")}</span>
                <span>Score: {entry.correct}/{entry.attempt.toFixed(0)} ({(entry.correct*100/entry.attempt).toFixed(2)}%)</span>
            </div>
        ))}
      </div>
    </>
  );
};

export default History;