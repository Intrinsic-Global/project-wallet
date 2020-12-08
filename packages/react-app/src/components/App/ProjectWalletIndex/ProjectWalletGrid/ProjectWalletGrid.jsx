import React from "react";
import { Address } from "../../..";
import { useContractReader } from "../../../../hooks";
import styled from "styled-components";
import { Card } from "antd";
import { useHistory } from "react-router-dom";

const Grid = styled.div`
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const GridElement = styled.div`
  cursor: pointer;
`;

export default function ProjectWalletGrid({ readContracts }) {
  // const projectWalletAddresses = useContractReader(readContracts, "TreatyIndex", "getTreatyIndex");
  const projectWalletDetails = useContractReader(readContracts, "TreatyIndex", "getDistributingTreatyDetails");
  const history = useHistory();
  console.log("projectWalletDetails :>> ", projectWalletDetails);

  // const projectWallets = projectWalletAddresses.map(x => {
  //   return {
  //     name: useContractReader(readContracts, "DistributingTreaty", "name"),
  //     id: useContractReader(readContracts, "DistributingTreaty", "id"),
  //     state: useContractReader(readContracts, "DistributingTreaty", "treatyState"),
  //   };
  // });
  return (
    <Grid>
      {projectWalletDetails &&
        projectWalletDetails.map(x => (
          <GridElement key={x.addr}>
            <Card title={x.name} onClick={() => history.push(`/projectwallet/${x.addr}`)}>
              <Address value={x.addr} />
            </Card>
          </GridElement>
        ))}
    </Grid>
    // <Grid>
    //   {projectWalletAddresses &&
    //     projectWalletAddresses.map(x => (
    //       <GridElement>
    //         <Card title={}>
    //           <Address value={x} />
    //         </Card>
    //       </GridElement>
    //     ))}
    // </Grid>
  );
}
