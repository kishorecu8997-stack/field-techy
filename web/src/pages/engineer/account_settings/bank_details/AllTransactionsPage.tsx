import React from "react";
import TransactionDashboard from "./TransactionDashboard";

const AllTransactionsPage: React.FC = () => {
  // The parent layout container provides its own padding.
  // By removing the extra `p-4` div here, we allow the TransactionDashboard
  // component to utilize more of the available width, making the table wider.
  return <TransactionDashboard showAll />;
};

export default AllTransactionsPage;
