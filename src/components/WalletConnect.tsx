import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSigner, getAAWalletAddress } from '../utils/aaUtils';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface WalletConnectProps {
  onWalletConnected?: (eoaAddress: string, aaAddress: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eoaAddress, setEoaAddress] = useState('');
  const [aaAddress, setAaAddress] = useState('');

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await connectWallet();
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setEoaAddress('');
          setAaAddress('');
        } else {
          connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const signer = await getSigner();
      if (!signer) throw new Error('Failed to get signer from wallet');
      const address = await signer.getAddress();
      setEoaAddress(address);
      const aaWalletAddress = await getAAWalletAddress(signer);
      setAaAddress(aaWalletAddress);
      setIsConnected(true);
      if (onWalletConnected) onWalletConnected(address, aaWalletAddress);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="btn-primary"
      onClick={connectWallet}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? 'Connecting...' : isConnected ? `Connected: ${eoaAddress.slice(0, 6)}...` : 'Connect Wallet'}
    </motion.button>
  );
};

export default WalletConnect;