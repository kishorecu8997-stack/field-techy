import React from "react";

const TrendRow: React.FC<{ date: string; count: number }> = ({ date, count }) => (
  <div style={rowStyle}>
    <span>{date}</span>
    <span>{count} searches</span>
  </div>
);

export default TrendRow;

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #e0e0e0",
};
