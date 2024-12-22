import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { generateSigner, Umi } from "@metaplex-foundation/umi";
import { getExplorerLink } from "@solana-developers/helpers";
import { Cluster } from "@solana/web3.js"

export async function makeTree(umi: Umi) {
    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 3,
        maxBufferSize: 8,
    });

    await builder.sendAndConfirm(umi);

    return merkleTree.publicKey
}
