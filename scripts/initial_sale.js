const opensea = require('opensea-js');
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();

/////////////////////
// Variables
////////////////////
const isInfura = !!process.env.INFURA_KEY;
const amountToCreate = 10; // The amount of sell orders to create 

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const API_KEY = process.env.API_KEY || ''; // API key is optional but useful if you're doing a high volume of requests.

const FIXED_PRICE_OPTION_ID = '0';
const NUM_FIXED_PRICE_AUCTIONS = 2;
const FIXED_PRICE = 0.05;

///////////////////////
// Settings Check
///////////////////////
if (!MNEMONIC || !NODE_API_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error('Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address.');
  process.exit(1);
}

if (!FACTORY_CONTRACT_ADDRESS) {
  console.error('Please specify a factory contract address.');
  process.exit(1);
}

///////////////////////
// Wallet
///////////////////////
const network = NETWORK === 'mainnet' || NETWORK === 'live' ? 'mainnet' : 'rinkeby';
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: MNEMONIC,
  },
  providerOrUrl: isInfura
    ? 'https://' + network + '.infura.io/v3/' + NODE_API_KEY
    : 'https://eth-' + network + '.alchemyapi.io/v2/' + NODE_API_KEY,
});

///////////////////////
// Seaport
///////////////////////
const seaport = new OpenSeaPort(
  provider,
  {
    networkName:
      NETWORK === 'mainnet' || NETWORK === 'live'
        ? Network.Main
        : Network.Rinkeby,
    apiKey: API_KEY,
  },
  (arg) => console.log(arg)
);

async function main() {
  // Example: many fixed price auctions for a factory option.
  console.log('Creating fixed price auctions...');

  for (let i = 0; i < amountToCreate; i++) {
    try {
      const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
      const fixedSellOrders = await seaport.createFactorySellOrders({
        assets: [
          {
            tokenId: FIXED_PRICE_OPTION_ID,
            tokenAddress: FACTORY_CONTRACT_ADDRESS,
          },
        ],
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE,
        numberOfOrders: NUM_FIXED_PRICE_AUCTIONS,
        expirationTime: expirationTime,
      });

      console.log('Created another ' + fixedSellOrders + ' sell order(s)');
    } catch (e) {
      console.log(e);
    }
    console.log("Sell Orders Created: " + ((1 + i) * NUM_FIXED_PRICE_AUCTIONS));
  }
}

////////////////////////
// Main Start
///////////////////////
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
