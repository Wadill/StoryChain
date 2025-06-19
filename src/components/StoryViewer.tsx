import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const STORY_ABI = [
  'function getStoryChapters(uint256 storyId) public view returns (uint256[] memory)',
  'function stories(uint256) public view returns (uint256 storyId, string memory title, address creator, uint256[] memory chapterIds)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
];

interface StoryViewerProps {
  signer: ethers.Signer | undefined;
  aaAddress: string;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ signer, aaAddress }) => {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      if (!signer) return;
      setIsLoading(true);
      try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NERO_TESTNET_PROVIDER_URL);
        const contract = new ethers.Contract(process.env.REACT_APP_NFT_CONTRACT!, STORY_ABI, provider);
        const storyCount = await contract.storyCount();
        const fetchedStories = [];
        for (let i = 1; i <= storyCount; i++) {
          const story = await contract.stories(i);
          fetchedStories.push({
            storyId: story.storyId.toString(),
            title: story.title,
            creator: story.creator,
          });
        }
        setStories(fetchedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        toast.error('Failed to fetch stories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [signer]);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Explore Stories</h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading stories...</p>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <motion.div
              key={story.storyId}
              className="border rounded-md p-4 bg-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold text-lg">{story.title}</h3>
              <p className="text-sm text-gray-600">Creator: {story.creator.slice(0, 6)}...</p>
              <button className="btn-secondary mt-2">View Chapters</button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No stories found. Create one!</p>
      )}
    </div>
  );
};

export default StoryViewer;