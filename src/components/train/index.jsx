import React, { useEffect, useState } from "react";
import "./styles.css";
import Content from "../content";

const Train = ({ contentRef, page }) => {
  const [content, setContent] = useState("");

  const pages = [
    `
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  # For
  `,
    `
  # Against
  # Against
  # Against
  `,
    `
  # Versus
  # Versus
  # Versus
  `,
  ];

  useEffect(() => {
    setContent(pages[page]);
  }, [page]);

  return (
    <>
      <div className="train">
        <Content ref={contentRef} content={content} />
      </div>
    </>
  );
};

export default Train;
