# projectwallet

Make agreements onchain including distribution of incoming ETH or ERC20 tokens.

A proposed distribution becomes active once all signers have agreed.

Users can withdraw their share of any incoming funds.

Agreements can be represented by text stored in the contract, or as a hash of content stored elsewhere, such as IPFS.

See https://github.com/grifma/treatify-web3 for an example of integration with IPFS / 3box.

---

## quickstart

```bash

yarn install

```

> you might get node-gyp errors, ignore them and run:

```bash

yarn start

```

> in a second terminal window:

```bash

yarn chain

```

> in a third terminal window:

```bash

yarn deploy

```
