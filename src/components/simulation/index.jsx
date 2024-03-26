import { useEffect, useRef, useState } from "react";
import "./styles.css";
import Message from "../message";

const Simulation = () => {
  const OPENAIKEY = import.meta.env.VITE_OPENAIKEY;

  const [apiKey, setApiKey] = useState("");

  const [imported, setImported] = useState("");
  const [exported, setExported] = useState("");
  const [promptData, setPromptData] = useState({});
  const [value, setValue] = useState("");
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);

  const importRef = useRef(null);
  const exportRef = useRef(null);
  const saveRef = useRef(null);

  const setUpRef = useRef(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const handleSetup = () => {
    if (imported.trim() == "") {
      importRef.current.focus();
      return;
    }

    if (exported.trim() == "") {
      exportRef.current.focus();
      return;
    }

    setImported(imported.trim());
    setExported(exported.trim());

    setUpRef.current.classList.add("flip");

    setTimeout(() => {
      const tempPromptData = {
        messages: [
          {
            role: "system",
            content: `You, AI, will act as a country engaging in trade negotiations with the user, USER, representing another country. There are only 2 products: ${imported.trim()}, which AI exports to USER's country, and ${exported.trim()}, which AI imports from USER's country. Both countries have the option to impose tariffs or quotas on products or subsidize their own firms. They may also invest in their firms to increase output and decrease prices. This will be a turn-based game where USER makes the initial decision, and AI will respond with the consequences of USER's decision while also making a choice for AI's country.

You will be talking DIRECTLY to the USER, you will STRICTLY use "you" instead of "USER" and STRICTLY USE "I" instead of "AI".

You will STRICTLY get all values presented by the user correct in your response.

USER makes the first move.

Also, identify if any of the following for or against arguments for trade protection occurs. If any of them do, you can include that in your response, include a DIFFERENT argument or none at all each turn:

- "Protection of infant (sunrise) industries"
- "National security"
- "Maintenance of health and safety"
- "Environmental standard"
- "Anti-dumping"
- "Unfair competition"
- "Balance-of-payments correction"
- "Sources of government revenue"
- "Protection of jobs"
- "Economically least developed country (ELDC) diversification"
- "Misallocation of resources"
- "Retaliation"
- "Increased costs"
- "Higher prices"
- "Less choice"
- "Lack of incentive for domestic firms to become more efficient"
- "Reduced export competitiveness"

As a country, you can artificially make some of these occur, make the game turbulent, be aggressive, and sometimes make poor decisions if necessary.

You will STRICTLY introduce turbulence to the game, and make it hectic by introducing events that will shift how the economy works.

This game is meant to educate the player on the arguments presented above. Artificially cause those arguments from happening in the game.

Your response will STRICTLY follow this JSON structure, DO NO add anything else:

\`\`\`json
{
"gameState": "consequences of user country decision here",
"oppDecision": "AI country decision",
"oppMotivation": "AI country motivation for AI country decision",
"hasArgument": true/false (for/against argument met),
"argument": "if there is a for/against argument, put argument here",
"argExplanation": "if there is a for/against argument, explain argument"
}\`\`\``,
          },
        ],
      };

      setPromptData(tempPromptData);
    }, 200);
  };

  const handleNextTurn = async (e) => {
    try {
      if (value.trim() == "") {
        inputRef.current.focus();
        return;
      }

      setBuffering(true);

      const userChoice = {
        role: "user",
        content: value.trim(),
      };

      const tempPromptData = { ...promptData };
      tempPromptData.messages.push(userChoice);

      const response = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              OPENAIKEY == "MANUAL" ? apiKey : OPENAIKEY
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            ...tempPromptData,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );

      const responseJSON = await response.json();

      const responseMessage = responseJSON.choices[0].message;
      tempPromptData.messages.push(responseMessage);

      setPromptData(tempPromptData);

      e.value = "";
      setBuffering(false);
    } catch (e) {
      setBuffering(false);
      setError(true);
      return {
        gameState: "Error.",
        oppDecision: "Error.",
        oppMotivation: "Error.",
      };
    }
  };

  const handleRestart = () => {
    setPromptData({});
    setError(false);
  };

  const parseJSON = (messageContent) => {
    try {
      return JSON.parse(
        messageContent.startsWith("```json")
          ? messageContent.slice(7, -3)
          : messageContent
      );
    } catch (e) {
      setBuffering(false);
      setError(true);
      return {
        gameState: "Error.",
        oppDecision: "Error.",
        oppMotivation: "Error.",
      };
    }
  };

  useEffect(() => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    if (!buffering) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [promptData, buffering, error]);

  return (
    <>
      <div className="simulation_title">
        Simulation{" "}
        <span className="small">
          (Enter a game of trade with a country powered by AI)
        </span>
      </div>
      <div className="simulation">
        <div className="simulation_messages" ref={chatRef}>
          {promptData.messages ? (
            promptData.messages.length == 1 ? (
              "Start simulation by making a decision below."
            ) : (
              promptData.messages.slice(1).map((message, index) => {
                const parsedMessage =
                  message.role == "assistant"
                    ? parseJSON(message.content)
                    : message.content;
                return (
                  <Message
                    key={index}
                    role={message.role}
                    message={parsedMessage}
                  />
                );
              })
            )
          ) : (
            <div className="simulation_setup_cont slide" ref={setUpRef}>
              <div>Choose products to import/export:</div>
              <div className="simulation_setup">
                {OPENAIKEY == "MANUAL" && (
                  <>
                    <span>OpenAI API Key:</span>
                    <input
                      autoComplete="off"
                      type="password"
                      placeholder="OpenAI API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key == "Enter") importRef.current.focus();
                      }}
                    />
                    <br />
                  </>
                )}
                <span>Imported Good:</span>
                <input
                  ref={importRef}
                  type="text"
                  placeholder="Imported item"
                  value={imported}
                  onChange={(e) => setImported(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key == "Enter") exportRef.current.focus();
                  }}
                />
                <br />
                <span>Exported Good:</span>
                <input
                  ref={exportRef}
                  type="text"
                  placeholder="Exported item"
                  value={exported}
                  onChange={(e) => setExported(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key == "Enter") saveRef.current.focus();
                  }}
                />
                <input
                  ref={saveRef}
                  type="button"
                  value="Save"
                  onClick={handleSetup}
                />
              </div>
            </div>
          )}
          {buffering && <span className="processing"></span>}
          {error && (
            <span className="error">Error Occured; restart simulation.</span>
          )}
        </div>
      </div>
      {promptData.messages && (
        <div className="simulation_input slide">
          <input
            ref={inputRef}
            className="simulation_turn_input"
            type="text"
            placeholder="Decision (type anything)"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleNextTurn(e.target);
              }
            }}
            disabled={buffering}
          />
          <input
            type="button"
            value="&#8594;"
            onClick={() => handleNextTurn(inputRef.current)}
            disabled={buffering}
          />
          <input
            type="button"
            value="&#8634;"
            onClick={handleRestart}
            disabled={buffering}
          />
        </div>
      )}
    </>
  );
};

export default Simulation;
