import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnect from './components/WalletConnect';
import StoryCreator from './components/StoryCreator';
import StoryViewer from './components/StoryViewer';
import { getSigner, getAAWalletAddress, initAABuilder, executeOperation } from './utils/aaUtils';
import './App.css';

const App: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [eoaAddress, setEoaAddress] = useState<string>('');
  const [aaAddress, setAaAddress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'create' | 'view'>('create');

  const handleWalletConnected = async (eoaAddr: string, aaAddr: string) => {
    try {
      const realSigner = await getSigner();
      setEoaAddress(eoaAddr);
      setAaAddress(aaAddr);
      setSigner(realSigner);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error getting signer:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer />
      <header className="bg-primary text-white py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold">StoryChain</h1>
          <WalletConnect onWalletConnected={handleWalletConnected} />
        </div>
      </header>
      <main className="container py-8">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'create' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('create')}
          >
            Create Story
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'view' ? 'bg-primary text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('view')}
          >
            View Stories
          </button>
        </div>
        <AnimatePresence>
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StoryCreator signer={signer} aaAddress={aaAddress} />
            </motion.div>
          )}
          {activeTab === 'view' && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StoryViewer signer={signer} aaAddress={aaAddress} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="bg-primary text-white py-4 text-center">
        <p>&copy; 2025 StoryChain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;