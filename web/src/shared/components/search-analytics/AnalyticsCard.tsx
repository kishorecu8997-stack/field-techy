import React from "react";

interface Props {
  title: string;
  value: string;
}

const AnalyticsCard: React.FC<Props> = ({ title, value }) => (
  <div style={cardStyle}>
    <p style={cardTitle}>{title}</p>
    <h3 style={cardValue}>{value}</h3>
  </div>
);

export default AnalyticsCard;

const cardStyle: React.CSSProperties = {
  flex: 1,
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #ddd",
  textAlign: "center",
};

const cardTitle: React.CSSProperties = {
  color: "#777",
  marginBottom: 8,
};

const cardValue: React.CSSProperties = {
  fontSize: "1.6rem",
  fontWeight: 600,
};
