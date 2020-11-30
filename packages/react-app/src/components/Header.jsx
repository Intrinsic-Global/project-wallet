import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/grifma/project-wallet" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 Project Wallet"
        subTitle="rapid iteration from project to asset"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
