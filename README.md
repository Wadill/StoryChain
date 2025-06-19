# StoryChain: A SocialFi Storytelling NFT Platform

Welcome to **StoryChain**, an innovative decentralized application (dApp) built on the **NERO Chain** 
StoryChain transforms storytelling into a collaborative, ownership-driven experience where **each chapter is minted as an NFT**, traded seamlessly via **gasless transactions** using **Paymaster**, and presented through a polished, Web2-like interface.

Join us on a mission to onboard the next billion Web3 users through a platform that blends **creativity, community, and blockchain magic**.

---

## 🚀 What It Does

- ✍️ **Create Collaborative Stories**  
  Write and mint each chapter as an NFT. The first chapter is minted gas-free (Type 0 gas), and subsequent ones require story tokens (Type 2 gas).

- 🔁 **Trade NFTs**  
  Seamlessly exchange story chapters with Paymaster auto-adjusting gas fees based on popularity.

- 💬 **Engage Socially**  
  Use social logins to join a vibrant, creator-driven community with story previews, comments, and reactions.

- 🌐 **Onboard Easily**  
  Web2-like tutorials and a rich text editor with media support allow non-Web3 users to jump in without hurdles.

---

## 🧩 The Problem It Solves

- ❌ Eliminates gas fee barriers and blockchain complexity for new users.
- 💸 Empowers writers with ownership and earnings via tradable NFTs.
- 🌉 Bridges Web2 and Web3 with an intuitive and collaborative UX.
- 🧠 Tackles the undervaluation of creative work in traditional publishing systems.

---

## 🧪 Challenges I Ran Into

- Debugging NERO Chain’s Paymaster integration for frictionless (gasless) transactions.
- Handling Web3Auth social login quirks in React environments.
- Optimizing Framer Motion animations without sacrificing NFT interaction speed.
- Ensuring Solidity smart contract security for co-authored and dynamic storytelling.

---

## 🛠️ Technologies I Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion  
- **Blockchain**: Solidity, Hardhat, NERO Chain Testnet, OpenZeppelin Contracts  
- **Wallet & Auth**: Ethers.js, Web3Auth, NERO Paymaster (AA-Platform)  
- **Utils**: dotenv, react-toastify  

---

## 🧱 How We Built It

1. **Vision & Design**: Sketched a utopia for collaborative storytelling, then translated it into a sleek React frontend.
2. **Smart Contract**: Developed the StoryChain NFT contract in Solidity; deployed on the NERO Chain Testnet using Hardhat.
3. **Paymaster Integration**: Enabled gasless mints via Type 0 and 2 flows through NERO’s Paymaster platform.
4. **Animations & UX**: Used Framer Motion for delightful transitions and Web3Auth for easy social onboarding.
5. **Testing & Refinement**: Constant iteration with testnet deployments and feedback from early users and NERO community.

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MetaMask wallet (configured for NERO Testnet)
- NERO Testnet tokens (from [NERO Faucet](https://faucet.nerochain.io))
- Code editor (e.g., VSCode)

### Steps

1. **Clone the Repository**
```bash
   git clone https://github.com/Wadill/StoryChain.git
   cd storychain
````

2. **Install Dependencies**

```bash
   npm install
```

3. **Configure Environment**
   Create a `.env` file in the root directory with the following:

   ```env
   REACT_APP_PAYMASTER_API_KEY=your_api_key_from_aa_platform
   REACT_APP_NFT_CONTRACT=0x63f1f7c6a24294a874d7c8ea289e4624f84b48cb
   REACT_APP_NERO_TESTNET_PROVIDER_URL=https://rpc-testnet.nerochain.io
   REACT_APP_PRIVATE_KEY=your_private_key_here
   ```

   Replace the placeholders with actual values.

4. **Run the Application**

   ```bash
   npm start
   ```

5. **Connect Wallet**
   Open [http://localhost:3000](http://localhost:3000) and connect using MetaMask + social login via Web3Auth.

---

## 🎮 Usage

* **Create a Story**: Click “Create Story,” input a title and chapter, and mint your first NFT gas-free.
* **View Stories**: Browse the “View Stories” section to discover, read, and comment on community tales.
* **Trade Chapters** *(Coming Soon)*: Enable marketplace-style trading of story NFTs with one-click Paymaster magic.

---

## 🧠 What We Learned

* Account abstraction with Paymaster is a game-changer for onboarding Web2 users.
* Component modularity helps maintain clean separation for Web3Auth, NFT minting, and UI rendering.
* Smooth animations uplift UX but must be finely tuned with real-time Web3 data calls.
* Web3-native storytelling requires deep user empathy and clear onboarding paths.

---

## 🌱 What's Next for StoryChain

### 🌊 Wave 6 (Upcoming)

* Gamified storytelling with **RPG quests**, **character NFTs**, and **community DAOs** for collaborative governance.

### 🌊 Wave 7 (Vision)

* DeFi-powered **NFT lending**, **content staking**, and a **tokenized story fund** for creators.

### 🧠 Future Features

* AR/VR integration for immersive storytelling
* Voice-mode mobile app
* Cross-platform support, including X (formerly Twitter) integrations

### 🌍 Community Goals

* Partner with literary creators & influencers
* Host global storytelling contests
* Foster a creative economy through token incentives

---

## 🤝 Contributing

We welcome contributions!
