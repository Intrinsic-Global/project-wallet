const dev = {
  REACT_APP_INFURA_ID: process.env.REACT_APP_INFURA_ID,
  REACT_APP_ETHERSCAN_KEY: process.env.REACT_APP_ETHERSCAN_KEY,
};

const prod = {
  REACT_APP_INFURA_ID: process.env.REACT_APP_INFURA_ID,
  REACT_APP_ETHERSCAN_KEY: process.env.REACT_APP_ETHERSCAN_KEY,
};

const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  ...config,
};
