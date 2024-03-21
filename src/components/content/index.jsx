import React from "react";
import "./styles.css";
import Markdown from "react-markdown";

const Content = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="markdown_content">
      <Markdown children={props.content} />
    </div>
  );
});

export default Content;
