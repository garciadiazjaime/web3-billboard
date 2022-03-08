import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const web3 = createAlchemyWeb3(alchemyKey); 

import contractABI from './contract-abi.json';
const contractAddress = process.env.CONTRACT_ADDRESS

export const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log('addressArray', addressArray)

      if (addressArray.length > 0) {
        return {
          address: addressArray[0]
        }
      }

      return {
        status: '🦊 Connect to Metamask using the <connect> button.'
      }
    } catch (err) {
      return {
        status: `😥  ${err.message}`,
      }
    }
  }

  return {
    status: 'You must install Metamask, a virtual Ethereum wallet, in your browser.'
  }
};

export const connectWallet = async () => {
  try {
    const addressArray = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return {
      address: addressArray[0],
    };
  } catch (err) {
    return {
      status: `😥  ${err.message}`,
    };
  }
};

export const loadCurrentMessage = async () => { 
  const message = await helloWorldContract.methods.message().call();

  return message;
};

export const updateMessage = async (address, message) => {
  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
 const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: helloWorldContract.methods.update(message).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return {
      status: `https://ropsten.etherscan.io/tx/${txHash}`
    };
  } catch (error) {
    return {
      status: `😥 ${error.message}`,
    };
  }
};
