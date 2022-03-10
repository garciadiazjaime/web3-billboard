const { createAlchemyWeb3 } = require('@alch/alchemy-web3')

const alchemyKey = process.env.ALCHEMY_KEY
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../../support/contract-abi.json');
const contractAddress = process.env.CONTRACT_ADDRESS

const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

exports.handler = async function (event, context) {
  const message = await helloWorldContract.methods.message().call()

  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
}
