import React, { useState } from "react";
import { Button, List, Divider, Input, Card, Table, Tag } from "antd";
import { Address } from "../../..";
import { useContractReader, useEventListener, useBalance } from "../../../../hooks";
import { parseEther, formatEther } from "@ethersproject/units";

const EventsPane = ({ readContracts, localProvider, mainnetProvider }) => {
  const allocatedEvents = useEventListener(readContracts, "DistributingTreaty", "Allocated", localProvider, 1);
  const signedByAllEvents = useEventListener(readContracts, "DistributingTreaty", "SignedByAll", localProvider, 1);
  const setSplitEvents = useEventListener(readContracts, "DistributingTreaty", "SetSplit", localProvider, 1);
  const withdrawEvents = useEventListener(readContracts, "DistributingTreaty", "Withdraw", localProvider, 1);
  const receivedEvents = useEventListener(readContracts, "DistributingTreaty", "Received", localProvider, 1);

  // console.log("allocatedEvents :>> ", allocatedEvents);
  // console.log("signedByAllEvents :>> ", signedByAllEvents);
  // console.log("setSplitEvents :>> ", setSplitEvents);
  // console.log("withdrawEvents :>> ", withdrawEvents);
  // console.log("receivedEvents :>> ", receivedEvents);

  return (
    <div>
      <div style={{ margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        {/* <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <List
            bordered
            dataSource={receivedEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item._amount}>
                  Received {formatEther(item._amount)}
                  &nbsp;ETH &nbsp;at block {item.blockNumber}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            dataSource={allocatedEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item._account + "_" + item._amount}>
                  Allocated to&nbsp;
                  <Address value={item._account} ensProvider={mainnetProvider} fontSize={16} />
                  {formatEther(item._amount)}
                  &nbsp;ETH &nbsp;at block {item.blockNumber}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            dataSource={signedByAllEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item._treatyAddress}>
                  Signed By All &nbsp;
                  <Address value={item._treatyAddress} ensProvider={mainnetProvider} fontSize={16} />
                  &nbsp;at block&nbsp;
                  {item.blockNumber}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            dataSource={setSplitEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item._split}>
                  Agreed on split &nbsp;
                  {item._split.forEach(x => {
                    return x;
                  })}
                  &nbsp;at block&nbsp;
                  {item.blockNumber}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            dataSource={withdrawEvents}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item._amount}>
                  Withdraw <Address value={item._to} ensProvider={mainnetProvider} fontSize={16} />{" "}
                  {formatEther(item._amount)}
                  ETH at block &nbsp;
                  {item.blockNumber}
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPane;
