export const useTradeMDs = (setPages) => {
  const fetchMarkdown = async (path) => {
    const response = await fetch(path);
    return await response.text();
  };

  Promise.all([
    import("./md/ArgumentsForTradeProtection.md").then((res) =>
      fetchMarkdown(res.default)
    ),
    import("./md/ArgumentsAgainstTradeProtection.md").then((res) =>
      fetchMarkdown(res.default)
    ),
    import("./md/FreeTradeVersusTradeProtection.md").then((res) =>
      fetchMarkdown(res.default)
    ),
  ]).then((texts) => {
    setPages(texts);
  });
};
