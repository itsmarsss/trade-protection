import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Markdown from "react-markdown";
import { useTradeMDs } from "../../data/trainMDs";

const Train = ({ page }) => {
  const [content, setContent] = useState("");

  const [pages, setPages] = useState([]);

  useEffect(() => {
    setContent(pages[page]);
  }, [page, pages]);

  useEffect(() => {
    useTradeMDs(setPages);
  }, []);

  return (
    <>
      <div className="train">
        <Markdown
          children={content}
          components={{
            a: (props) => {
              return <a href={props.href}>{props.children}</a>;
            },
            h2: (props) => {
              return (
                <h2 id={props.children.toLowerCase().replace(/[^a-z0-9]/g, "")}>
                  ~ {props.children}
                </h2>
              );
            },
            h3: (props) => {
              return (
                <h3 id={props.children.toLowerCase().replace(/[^a-z0-9]/g, "")}>
                  {props.children}
                </h3>
              );
            },
          }}
        />
      </div>
    </>
  );
};

export default Train;
