import React, { useEffect, useState } from "react";
import "./styles.css";
import Markdown from "react-markdown";

const Train = ({ page }) => {
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
        <Markdown children={content} />
      </div>
    </>
  );
};

export default Train;
