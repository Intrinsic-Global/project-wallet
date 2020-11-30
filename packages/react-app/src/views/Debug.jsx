import React, { useCallback, useEffect, useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, InputNumber } from "antd";
import { SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { Address, AddressInput, Balance } from "../components";
import { useContractReader, useEventListener, useResolveName, useBalance } from "../hooks";
import { parseEther, formatEther } from "@ethersproject/units";
import { validate } from "graphql";

export default function Debug({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {
  
  return (
    <div>
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64,overflow:"hidden"}}>
        <h2>Project Wallet</h2>
      
      </div>

    </div>
  );
}

