import React from "react";

interface Props {
  keyword: string;
  count: number;
  total: number;
}

const KeywordRow: React.FC<Props> = ({ keyword, count, total }) => {
  const percentage = Math.round((count / total) * 100);

  return (
    <div style={rowStyle}>
      <span>{keyword}</span>
      <span>
        {count} ({percentage}%)
      </span>
    </div>
  );
};

export default KeywordRow;

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #e0e0e0",
};
