const express = require("express");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const cors = require("cors");
const Web3Utils = require("web3-utils");

const app = express();
const port = 8004; // You can choose a different port if needed

// Middleware to parse JSON request bodies
const corsOptions = {
  origin: "*", // Allow requests from all origins
};

app.use(cors(corsOptions)); // Use the cors middleware with the specified options

app.use(express.json());

app.get("/fetchAllNFTs", async (req, res) => {
  try {
    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0xD60d302B936D3d9c56F5A0225EF9A191a7D12871"
    );

    const nfts = await contract.erc721.getAll();
    res.json(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "An error occurred while fetching NFTs." });
  }
});
app.get("/fetchTokenBalance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0xD650834b4A40C58482F68320bC248eDe98D6506F"
    );

    const balance = await contract.erc20.balanceOf(walletAddress);
    res.json(balance);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ error: "An error occurred while fetching NFTs." });
  }
});
app.get("/fetchERC20TokenBalance/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0xD650834b4A40C58482F68320bC248eDe98D6506F"
    );

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
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0xD60d302B936D3d9c56F5A0225EF9A191a7D12871"
    );
    // Load all NFTs
    const allNFTs = await contract.erc721.getAll();

    // Get the NFTs owned by the specified wallet address
    const nftsOwnedByWallet = allNFTs.filter(
      (nft) => nft.owner.toLowerCase() === walletAddress.toLowerCase()
    );

    res.json(nftsOwnedByWallet);
  } catch (error) {
    console.error("Error fetching NFTs for wallet:", error);
    res.status(500).json({ error: error });
  }
});
app.get("/getstakedNFTsForWallet/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;
    console.log(walletAddress)

    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0x64C3c9841f2a6ad50C546392cEB24fDEfBb48d1B"
    );
    const nftContract = await sdk.getContract(
      "0xD60d302B936D3d9c56F5A0225EF9A191a7D12871"
    );

    const nftsOwnedByWallet = await contract.call("getStakeInfo", [
      walletAddress,
    ]);

    // Extract the token IDs from the response
    const tokenIds = nftsOwnedByWallet[0];
    console.log(tokenIds);

// Fetch the total reward (assuming it's constant)
const totalRewardHex = nftsOwnedByWallet[1]._hex;
const totalRewardWei = BigInt(totalRewardHex);
const totalReward = Number(totalRewardWei / BigInt(1e18)); // Convert to a regular number
console.log(totalReward); // This will be the total reward as a normal number

    // Create an array to store information for each tokenId and details
    const nftInfo = [];

    for (const tokenId of tokenIds) {
      // Fetch information for the current tokenId
      const nftDetails = await nftContract.erc721.get(tokenId);

      // Push the details into the nftInfo array
      nftInfo.push(nftDetails);
    }

    // Create the response object with nftDetails and totalReward
    const responseObject = {
      nftDetails: nftInfo,
      totalReward: totalReward,
    };

    res.json(responseObject);
  } catch (error) {
    console.error("Error fetching NFTs for wallet:", error);
    res.status(500).json({ error: error });
  }
});

// Route to fetch an NFT using a tokenId from req.body
app.post("/getNFTByTokenId", async (req, res) => {
  try {
    const tokenId = req.body.tokenId; // Assuming the request body contains a tokenId field
    const sdk = new ThirdwebSDK("polygon", {
      secretKey:
        "U44uvKQJkQYLdnDdxHfBnjQDfG_mx6jUUulCvo2l9UyJGvqx2inzPu2EypIvVrnonMtAW_2h2Dn0Z3Rfux2LHg",
    });

    const contract = await sdk.getContract(
      "0x710E9161e8A768c0605335AB632361839f761374"
    );

    const nft = await contract.erc721.get(tokenId);
    res.json(nft);
  } catch (error) {
    console.error("Error fetching NFT by tokenId:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching NFT by tokenId." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
