import { useEffect, useRef, useState } from "react";
import "./styles.css";
import Message from "../message";

const Simulation = () => {
  const OPENAIKEY = import.meta.env.VITE_OPENAIKEY;

  const [imported, setImported] = useState("");
  const [exported, setExported] = useState("");
  const [promptData, setPromptData] = useState({});
  const [value, setValue] = useState("");

  const chatRef = useRef(null);

  const handleSetup = () => {
    const tempPromptData = {
      messages: [
        {
          role: "system",
          content: `You, AI, will act as a country engaging in trade negotiations with the user, USER, representing another country. There are only 2 products: ${imported}, which AI exports to USER's country, and ${exported}, which AI imports from USER's country. Both countries have the option to impose tariffs or quotas on products or subsidize their own firms. They may also invest in their firms to increase output and decrease prices. This will be a turn-based game where USER makes the initial decision, and AI will respond with the consequences of USER's decision while also making a choice for AI's country.

You will be talking DIRECTLY to the USER, you will STRICTLY use "you" instead of "USER" and "I" instead of "AI".

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
  };

  const handleNextTurn = async (e) => {
    const userChoice = {
      role: "user",
      content: value,
    };

    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAIKEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        ...promptData,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    const responseJSON = await response.json();

    const tempPromptData = { ...promptData };
    tempPromptData.messages.push(userChoice);

    const responseMessage = responseJSON.choices[0].message;
    tempPromptData.messages.push(responseMessage);

    setPromptData(tempPromptData);

    e.value = "";
  };

  useEffect(() => {
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [promptData]);

  return (
    <>
      <div className="simulation">
        <div className="simulation_messages" ref={chatRef}>
          {promptData.messages ? (
            promptData.messages.slice(1).map((message, index) => {
              const parsedMessage =
                message.role == "assistant"
                  ? JSON.parse(
                      message.content.startsWith("```json")
                        ? message.content.slice(7, -3)
                        : message.content
                    )
                  : message.content;
              return (
                <Message
                  key={index}
                  role={message.role}
                  message={parsedMessage}
                />
              );
            })
          ) : (
            <>
              <div>Choose products to import/export:</div>
              <div className="simulation_setup">
                <span>Imported Good:</span>
                <input
                  type="text"
                  placeholder="Imported item"
                  onChange={(e) => setImported(e.target.value)}
                />
                <br />
                <span>Exported Good:</span>
                <input
                  type="text"
                  placeholder="Exported item"
                  onChange={(e) => setExported(e.target.value)}
                />
                <input type="button" value="Save" onClick={handleSetup} />
              </div>
            </>
          )}
        </div>
      </div>
      {promptData.messages && (
        <div className="simulation_input">
          <input
            className="simulation_turn_input"
            type="text"
            placeholder="Decision (type anything)"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleNextTurn(e.target);
              }
            }}
          />
          <input
            type="button"
            value="&#8594;"
            onClick={(e) => handleNextTurn(e.target.previousSibling)}
          />
        </div>
      )}
    </>
  );
};

export default Simulation;
