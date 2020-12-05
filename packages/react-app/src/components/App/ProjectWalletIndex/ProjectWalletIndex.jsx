import React, { useState } from "react";
import { Card } from "antd";
import { Address } from "../..";
import { useContractReader } from "../../../hooks";
import styled from "styled-components";
import { ProjectWalletGrid } from "./ProjectWalletGrid";
import { ProjectWalletIndexControls } from "./ProjectWalletIndexControls";

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-top: 50px;
`;

const Controls = styled.div`
  flex: 1 0 200px;
`;

const Grid = styled.div`
  flex: 1 0 600px;
`;

export default function ProjectWalletIndex({ mainnetProvider, localProvider, tx, readContracts, writeContracts }) {
  return (
    <Main>
      <Controls>
        <ProjectWalletIndexControls
          readContracts={readContracts}
          writeContracts={writeContracts}
          tx={tx}
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
        />
      </Controls>
      <Grid>
        <ProjectWalletGrid
          readContracts={readContracts}
          writeContracts={writeContracts}
          tx={tx}
          localProvider={localProvider}
          mainnetProvider={mainnetProvider}
        />
      </Grid>
    </Main>
  );
}
