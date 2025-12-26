import React from "react";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div style={sectionStyle}>
    <h4 style={headingStyle}>{title}</h4>
    {children}
  </div>
);

export default Section;

const sectionStyle: React.CSSProperties = {
  background: "#f9f9f9",
  padding: 16,
  borderRadius: 8,
  marginBottom: 32,
};

const headingStyle: React.CSSProperties = {
  marginBottom: 12,
  fontSize: "1.2rem",
};

