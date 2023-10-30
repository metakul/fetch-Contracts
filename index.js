const express = require("express");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const cors = require('cors');

const app = express();
const port = 8004; // You can choose a different port if needed

// Middleware to parse JSON request bodies
const corsOptions = {
  origin: '*', // Allow requests from all origins
};


app.use(cors(corsOptions)); // Use the cors middleware with the specified options

app.use(express.json());

app.get("/fetchAllNFTs", async (req, res) => {
  try {
    const sdk = new ThirdwebSDK("polygon", {
      secretKey: "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract("0x710E9161e8A768c0605335AB632361839f761374");

    const nfts = await contract.erc721.getAll();
    res.json(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "An error occurred while fetching NFTs." });
  }
});
app.post("/fetchTokenBalance", async (req, res) => {
  try {
    const walletAddress = req.body.walletAddress;
    const sdk = new ThirdwebSDK("polygon", {
      secretKey: "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract("0xE9fd323D7B1e4cFd07C657E218F7da16efd6532f");

    const balance = await contract.erc20.balanceOf(walletAddress);
    res.json(balance);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "An error occurred while fetching NFTs." });
  }
});

app.get("/getNFTsForWallet/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    const sdk = new ThirdwebSDK("mumbai", {
      secretKey: "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract("0xD97f7972A9f82f775d6a528f04Ff937EaDFFBCE7");

    const balance = await contract.erc721.balanceOf(walletAddress);
    res.json({ balance });
  } catch (error) {
    console.error("Error fetching NFT balance for wallet:", error);
    res.status(500).json({ error: "An error occurred while fetching NFT balance for the wallet." });
  }
});

// Route to fetch an NFT using a tokenId from req.body
app.post("/getNFTByTokenId", async (req, res) => {
  try {
    const tokenId = req.body.tokenId; // Assuming the request body contains a tokenId field
    const sdk = new ThirdwebSDK("polygon", {
      secretKey: "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract("0x710E9161e8A768c0605335AB632361839f761374");

    const nft = await contract.erc721.get(tokenId);
    res.json(nft);
  } catch (error) {
    console.error("Error fetching NFT by tokenId:", error);
    res.status(500).json({ error: "An error occurred while fetching NFT by tokenId." });
  }
});
app.post("/claimNft", async (req, res) => {
  try {
    const sdk = new ThirdwebSDK("polygon", {
      secretKey: "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract("0x710E9161e8A768c0605335AB632361839f761374");

    const quantity = 1;
    const tx = await contract.erc721.claim.prepare(quantity);
        res.json(tx);
  } catch (error) {
    console.error("Error fetching NFT by tokenId:", error);
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
export default app
