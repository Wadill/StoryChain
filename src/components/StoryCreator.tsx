import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { executeOperation } from '../utils/aaUtils';
import { toast } from 'react-toastify';

const STORY_ABI = [
  'function createStory(string memory title, string memory firstChapterUri) returns (uint256)',
  'function addChapter(uint256 storyId, string memory chapterUri)',
];

interface StoryCreatorProps {
  signer: ethers.Signer | undefined;
  aaAddress: string;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ signer, aaAddress }) => {
  const [title, setTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStory = async () => {
    if (!signer || !aaAddress) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!title || !chapterContent) {
      toast.error('Please provide a title and chapter content');
      return;
    }

    setIsLoading(true);
    try {
      const metadataUri = `https://ipfs.io/ipfs/sample-uri/${title}`; // Replace with actual IPFS upload
      const result = await executeOperation(
        signer,
        process.env.REACT_APP_NFT_CONTRACT!,
        STORY_ABI,
        'createStory',
        [title, metadataUri],
        0 // Type 0 gas (sponsored)
      );
      toast.success(`Story created! Transaction: ${result.transactionHash}`);
      setTitle('');
      setChapterContent('');
    } catch (error: any) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Create a New Story</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text">Story Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Enter story title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text">First Chapter</label>
          <textarea
            value={chapterContent}
            onChange={(e) => setChapterContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Write the first chapter..."
            rows={6}
          />
        </div>
        <motion.button
          className="btn-primary w-full"
          onClick={handleCreateStory}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Creating...' : 'Create Story'}
        </motion.button>
      </div>
    </div>
  );
};

export default StoryCreator;