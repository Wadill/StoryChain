// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StoryChain is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Story {
        uint256 storyId;
        string title;
        address creator;
        uint256[] chapterIds;
    }

    mapping(uint256 => Story) public stories;
    mapping(uint256 => uint256) public chapterToStory;
    uint256 public storyCount;

    event StoryCreated(uint256 indexed storyId, string title, address creator);
    event ChapterMinted(uint256 indexed tokenId, uint256 storyId, string uri, address author);
    event ChapterTraded(uint256 indexed tokenId, address from, address to);

    constructor() ERC721("StoryChain", "STORY") Ownable(msg.sender) {}

    function createStory(string memory title, string memory firstChapterUri) public returns (uint256) {
        storyCount++;
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, firstChapterUri);

        stories[storyCount] = Story({
            storyId: storyCount,
            title: title,
            creator: msg.sender,
            chapterIds: new uint256[](0)
        });
        stories[storyCount].chapterIds.push(newTokenId);
        chapterToStory[newTokenId] = storyCount;

        emit StoryCreated(storyCount, title, msg.sender);
        emit ChapterMinted(newTokenId, storyCount, firstChapterUri, msg.sender);
        return storyCount;
    }

    function addChapter(uint256 storyId, string memory chapterUri) public {
        require(storyId <= storyCount, "Story does not exist");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, chapterUri);
        stories[storyId].chapterIds.push(newTokenId);
        chapterToStory[newTokenId] = storyId;

        emit ChapterMinted(newTokenId, storyId, chapterUri, msg.sender);
    }

    function tradeChapter(uint256 tokenId, address to) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        safeTransferFrom(msg.sender, to, tokenId);
        emit ChapterTraded(tokenId, msg.sender, to);
    }

    function getStoryChapters(uint256 storyId) public view returns (uint256[] memory) {
        require(storyId <= storyCount, "Story does not exist");
        return stories[storyId].chapterIds;
    }
}