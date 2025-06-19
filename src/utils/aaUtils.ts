import { ethers } from 'ethers';
import { Presets } from 'userop';

const NERO_CHAIN_CONFIG = {
  rpcUrl: process.env.REACT_APP_NERO_TESTNET_PROVIDER_URL || 'https://rpc-testnet.nerochain.io',
};

const AA_PLATFORM_CONFIG = {
  bundlerRpc: 'https://bundler-testnet.nerochain.io',
  paymasterRpc: 'https://paymaster-testnet.nerochain.io',
};

const CONTRACT_ADDRESSES = {
  entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
  nftContract: process.env.REACT_APP_NFT_CONTRACT || '',
};

const API_KEY = process.env.REACT_APP_PAYMASTER_API_KEY || '';

export const getSigner = async () => {
  if (!window.ethereum) throw new Error('No crypto wallet found. Please install MetaMask.');
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log('Connected wallet address:', address);
    return signer;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

export const getAAWalletAddress = async (accountSigner: ethers.Signer) => {
  try {
    if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
      throw new Error('Invalid signer object: must have a getAddress method');
    }
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
      accountSigner,
      NERO_CHAIN_CONFIG.rpcUrl,
      {
        overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
        entryPoint: CONTRACT_ADDRESSES.entryPoint,
        factory: CONTRACT_ADDRESSES.accountFactory,
      }
    );
    const address = await simpleAccount.getSender();
    console.log('AA wallet address:', address);
    return address;
  } catch (error) {
    console.error('Error getting AA wallet address:', error);
    throw error;
  }
};

export const initAABuilder = async (accountSigner: ethers.Signer, apiKey?: string) => {
  try {
    if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
      throw new Error('Invalid signer object: must have a getAddress method');
    }
    const builder = await Presets.Builder.SimpleAccount.init(
      accountSigner,
      NERO_CHAIN_CONFIG.rpcUrl,
      {
        overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
        entryPoint: CONTRACT_ADDRESSES.entryPoint,
        factory: CONTRACT_ADDRESSES.accountFactory,
      }
    );
    const currentApiKey = apiKey || API_KEY;
    builder.setPaymasterOptions({
      apikey: currentApiKey,
      rpc: AA_PLATFORM_CONFIG.paymasterRpc,
      type: '0',
    });
    builder.setCallGasLimit(300000);
    builder.setVerificationGasLimit(2000000);
    builder.setPreVerificationGas(100000);
    return builder;
  } catch (error) {
    console.error('Error initializing AA builder:', error);
    throw error;
  }
};

export const executeOperation = async (
  accountSigner: ethers.Signer,
  contractAddress: string,
  contractAbi: any,
  functionName: string,
  functionParams: any[],
  paymentType: number = 0,
  selectedToken: string = '',
  options?: { apiKey?: string; gasMultiplier?: number }
) => {
  try {
    const client = await initAAClient(accountSigner);
    const builder = await initAABuilder(accountSigner, options?.apiKey);
    if (paymentType > 0 && selectedToken) {
      builder.setPaymasterOptions({
        apikey: options?.apiKey || API_KEY,
        rpc: AA_PLATFORM_CONFIG.paymasterRpc,
        type: paymentType.toString(),
        token: selectedToken,
      });
    } else {
      builder.setPaymasterOptions({
        apikey: options?.apiKey || API_KEY,
        rpc: AA_PLATFORM_CONFIG.paymasterRpc,
        type: paymentType.toString(),
      });
    }
    const contract = new ethers.Contract(contractAddress, contractAbi, getProvider());
    const callData = contract.interface.encodeFunctionData(functionName, functionParams);
    const userOp = await builder.execute(contractAddress, 0, callData);
    console.log('Sending UserOperation to bundler');
    const res = await client.sendUserOperation(userOp);
    console.log('UserOperation sent with hash:', res.userOpHash);
    const receipt = await res.wait();
    if (receipt && receipt.transactionHash) {
      console.log('Transaction mined:', receipt.transactionHash);
    }
    return {
      userOpHash: res.userOpHash,
      transactionHash: receipt?.transactionHash || '',
      receipt,
    };
  } catch (error) {
    console.error('Error executing operation:', error);
    throw error;
  }
};

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
};

const initAAClient = async (accountSigner: ethers.Signer) => {
  // Placeholder for initializing AA client; extend as needed
  return {
    sendUserOperation: async (userOp: any) => ({
      userOpHash: '0xSampleHash',
      wait: async () => ({ transactionHash: '0xSampleTxHash' }),
    }),
  };
};