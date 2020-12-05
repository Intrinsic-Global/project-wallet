import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import { AddressInput } from "../../../AddressInput";
import styled from "styled-components";

const AddButton = styled(Button)`
  margin-bottom: 60px;
  margin-top: 10px;
`;

const ControlsForm = styled(Form)`
  .register-form {
    line-height: 1.4;
  }
  .form-group {
    background: #f6ddce;
    margin-bottom: 1em;
    padding: 10px;
  }
  .form-group ul {
    list-style: none;
    margin: 0 0 2em;
    padding: 0;
  }
  .form-group li {
    margin-bottom: 0.5em;
  }
  .form-group h3 {
    margin-bottom: 1em;
  }
  .form-fields input[type="text"],
  .form-fields input[type="tel"],
  .form-fields input[type="url"],
  .form-fields input[type="email"],
  .form-fields input[type="number"],
  .form-fields select {
    box-sizing: border-box;
    padding: 0.6em 0.8em;
    color: #999;
    background: #f7f7f7;
    border: 1px solid #e1e1e1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9em;
    text-decoration: none;
    line-height: normal;
    max-height: 3em;
  }
  .form-fields input[type="text"]:focus,
  .form-fields input[type="tel"]:focus,
  .form-fields input[type="url"]:focus,
  .form-fields input[type="email"]:focus,
  .form-fields input[type="number"]:focus,
  .form-food textarea:focus,
  .form-fields select:focus {
    color: #333;
    border: 1px solid #c17ccf;
    outline: none;
    background: #f2f2f2;
  }
  .form-food textarea {
    display: block;
    box-sizing: border-box;
    font: 0.9em Lato, Helvetica, sans-serif;
    width: 90%;
    height: 6em;
    overflow: auto;
    padding: 0.6em 0.8em;
    color: #999;
    background: #f7f7f7;
    border: 1px solid #e1e1e1;
    line-height: normal;
  }
  .register-btn {
    border-radius: 0px 2px 2px 0px;
    box-sizing: content-box;
    background: #8b798c;
    font-weight: 300;
    text-transform: uppercase;
    color: white;
    padding: 0.35em 0.75em;
    border: none;
    font-size: 1.1em;
    text-decoration: none;
    cursor: pointer;
  }
  .register-btn:hover,
  .register-btn:focus {
    background: #c17ccf;
  }
  /*flex it*/
  .register-form {
    display: flex;
    flex-wrap: wrap;
    margin-right: -2em;
  }
  .form-group {
    flex: 1 0 300px;
    margin-right: 2em;
  }
  .form-submit {
    flex: 0 0 100%;
  }
  .form-fields li {
    display: flex;
    flex-wrap: wrap;
  }
  .form-fields input[type="text"],
  .form-fields input[type="tel"],
  .form-fields input[type="url"],
  .form-fields input[type="email"],
  .form-fields input[type="number"],
  .form-fields select {
    flex: 1 0 230px;
  }
  .form-fields label {
    flex: 1 0 90px;
    max-width: 200px;
  }
  .form-skills,
  .form-workshop {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .form-skills li {
    width: 145px;
  }
  .form-workshop li {
    flex: 1 0 200px;
  }
  @media (max-width: 400px) {
    body {
      width: 100%;
      margin: 0;
      padding: 0 0 2em;
    }
    header,
    .form-submit {
      padding: 2% 5%;
    }
  }
`;

export default function ProjectWalletIndexControls({ tx, writeContracts }) {
  const [name, setName] = useState("");
  const [initialText, setInitialText] = useState("");
  const [addressToAdd, setAddressToAdd] = useState("");
  const id = Math.floor(Math.random() * 10 ** (process.env.ID_SIZE || 6));

  return (
    <ControlsForm>
      <form class="new-project-wallet">
        <h3>New Project Wallet</h3>
        <ul class="form-fields">
          <li>
            <label for="name">Name:</label>
            <Input
              name="pw-name"
              class="text-input"
              onChange={e => setName(e.target.value)}
              placeholder="Enter project wallet name"
            />
          </li>
          <li>
            <label for="street-address">Initial agreement text:</label>
            <Input
              name="pw-initial-text"
              class="text-input"
              onChange={e => setInitialText(e.target.value)}
              placeholder="Enter initial agreement text"
            />
          </li>
        </ul>
        <AddButton
          name="pw-deploy-new-treaty"
          onClick={() => tx(writeContracts.TreatyIndex.deployDistributingTreaty(id, name, initialText))}
        >
          Deploy
        </AddButton>
        {/* <Input
          name="pw-address-to-add"
          onChange={e => setAddressToAdd(e.target.value)}
          placeholder="Enter address to add"
        />
        <AddButton name="pw-add" onClick={() => tx(writeContracts.TreatyIndex.addTreaty(addressToAdd))}>
          Add Existing Project Wallet
        </AddButton> */}
      </form>
      <form class="add-project-wallet">
        <h3>Add Project Wallet</h3>
        <ul class="form-fields">
          <li>
            <label for="name">Address:</label>
            <Input
              name="pw-address-to-add"
              onChange={e => setAddressToAdd(e.target.value)}
              placeholder="Enter address to add"
            />
          </li>
        </ul>
        <AddButton name="pw-add" onClick={() => tx(writeContracts.TreatyIndex.addTreaty(addressToAdd))}>
          Add
        </AddButton>
      </form>
    </ControlsForm>
  );
}
