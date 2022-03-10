import { createAlchemyWeb3 } from '@alch/alchemy-web3';

const alchemyKey = process.env.ALCHEMY_KEY
const web3 = createAlchemyWeb3(alchemyKey); 

import contractABI from './contract-abi.json';
const contractAddress = "0xEAAa83Afa5a67f8b82614dDB8A3260a84729e218";

export const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export const isWeb3Enable = () => {
  if (!window.ethereum) {
    return {
      status: 'Install <a href="https://metamask.io/" target="_blank">Metamask</a> 🦊 so you can update the message.'
    }
  }

  return {}
}

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {
        return {
          address: addressArray[0]
        }
      }

      return {
        status: '🦊 Connect to Metamask'
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
      status: "❌ Try a few more letters 🙃.",
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
      status: `
        Awesome 😀
        <br />
        go back to to the homepage
        <br />
        sooner or later you will see your message.
        <br /><br />
        Here your <a href="https://ropsten.etherscan.io/tx/${txHash}" target="_blank">transaction</a> 🤓.
        `
    };
  } catch (error) {
    return {
      status: `😥 ${error.message}`,
    };
  }
};
