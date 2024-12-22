// import { Document, WithId } from "mongodb";
// import { User } from '../classes/User';
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { getExplorerLink, getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
// import { generateSigner, Keypair, keypairIdentity, percentAmount, Umi } from "@metaplex-foundation/umi";
// import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
// import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
// import { makeTree } from "./helpers/create-tree.helper";
// import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
// import multer from 'multer';

// const router = require("express").Router();

// const dotenv = require('dotenv');
// dotenv.config();

// let umi: Umi = createUmi(process.env.RPC_URL);

// (async () => {
//     const localKeypair = await getKeypairFromEnvironment("KEYPAIR");

//     const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

//     umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi()).use(mplTokenMetadata());
// })()

// router.post("/", async (req, res): Promise<void> => {

//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         if (!req.body.recipient) {
//             return res.status(400).json({ error: 'Recipient address required' });
//         }

//         const recipient = req.body.recipient;

//         const fileBuffer = req.file.buffer;

//         const uri = "https://fuchsia-rainy-kangaroo-898.mypinata.cloud/ipfs/QmS8Ku5gbAnP5ZpxTsrqzmEjJTfFkKPVVpAVUUfPxzkcES";

//         const mint = generateSigner(umi);
//         const transaction = await createNft(umi, {
//             mint,
//             name: "Mintgram",
//             // See https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
//             uri,
//             sellerFeeBasisPoints: percentAmount(0),
//             owner: recipient
//         });

//         await transaction.sendAndConfirm(umi);

//         const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

//         console.log(
//             `✨🖼️ Created NFT! Address is: ${getExplorerLink(
//                 "address",
//                 createdNft.mint.publicKey,
//                 "devnet"
//             )}`
//         );

//         console.log("✅ Finished successfully!");

//         res.status(200).json({ nftAddress: createdNft.mint.publicKey, nftImage: uri });
//     } catch (err) {
//         res.status(500).json({ error: err.toString() });
//     }
// });

// module.exports = router;