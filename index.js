const express = require("express");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const cors = require("cors");
const dotenv = require('dotenv');
const  { Alchemy, Network } =require( "alchemy-sdk")


dotenv.config()
const app = express();
const port = 8004; // You can choose a different port if needed
const config = {
  apiKey: "7xx7HGiKLrbuqtY0kD8vDSlF5MZTEIkC",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);


// Middleware to parse JSON request bodies
const corsOptions = {
  origin: "*", // Allow requests from all origins
};

app.use(cors(corsOptions)); // Use the cors middleware with the specified options

app.use(express.json());

const thirdwebSecretKey=process.env.THIRDWEB_SECRET_KEY.toString()
const ERC20Address=process.env.ERC20Address
const ERC721Address=process.env.ERC721Address
const StakingAddress=process.env.StakingAddress
console.log(thirdwebSecretKey,ERC721Address,ERC721Address)


app.get("/fetchAllNFTs", async (req, res) => {
  try {
    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        thirdwebSecretKey,
    });

    const contract = await sdk.getContract(
      ERC721Address
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
        thirdwebSecretKey,
    });

    const contract = await sdk.getContract(
      ERC20Address
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
        thirdwebSecretKey,
    });

    const contract = await sdk.getContract(
      ERC20Address
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
    // Get NFTs for the specified owner
    
    const nfts = await alchemy.nft.getNftsForOwner(walletAddress);
    console.log(nfts)

    // Send the NFTs as a JSON response
    res.json({ nfts });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get("/getNFTsForWallet/thirdweb/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        thirdwebSecretKey,
    });

    const contract = await sdk.getContract(
      ERC721Address
    );
    // Load all NFTs
    const nfts = await contract.erc721.getOwned(walletAddress);


    res.json(nfts);
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
        thirdwebSecretKey,
    });

    const contract = await sdk.getContract(
      StakingAddress
    );
    const nftContract = await sdk.getContract(
      ERC721Address
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
    const sdk = new ThirdwebSDK("mumbai", {
      secretKey:
        thirdwebSecretKey,
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
