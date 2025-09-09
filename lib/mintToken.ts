import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import * as mplTokenMetadata from "@metaplex-foundation/mpl-token-metadata";

export async function mintToken(
  connection: Connection,
  wallet: WalletContextState,
  amount: number,
  name: string,
  symbol: string,
  imageUri: string,
  immutable: boolean = false,
  revokeMintAuthority: boolean = false,
  freezeAuthority: boolean = false,
  revokeFreezeAuthority: boolean = false
) {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error("Wallet not connected");
  }

  const mintKeypair = Keypair.generate();
  const tokenAddress = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    wallet.publicKey
  );

  const feeInstruction = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: new PublicKey("7S2j4a76DAJgtR99YFcRdwZk7mR5ojN9Jbd1CryL9JqE"),
    lamports: 0.1 * 1e9, // 0.1 SOL in lamports
  });

  const transaction = new Transaction().add(
    feeInstruction,
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: 82,
      lamports: await connection.getMinimumBalanceForRentExemption(82),
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9,
      wallet.publicKey,
      freezeAuthority ? wallet.publicKey : null
    ),
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      tokenAddress,
      wallet.publicKey,
      mintKeypair.publicKey
    ),
    createMintToInstruction(
      mintKeypair.publicKey,
      tokenAddress,
      wallet.publicKey,
      amount * Math.pow(10, 9)
    )
  );

  // const metaplexFile = await toMetaplexFile(await iconFile.arrayBuffer(), iconFile.name);
  // const imageUri = "<PINATA_IMAGE_URI>";
  // const { uri: metadataUri } = await metaplex
  //   .nfts()
  //   .uploadMetadata({
  //     name: name,
  //     symbol: symbol,
  //     image: imageUri,
  //   });
  const metadataUri = imageUri;
  console.log("Metadata URI:", metadataUri);
  console.log("Metadata Values -> Name:", name, "Symbol:", symbol, "Image URI:", metadataUri);

  const metadataPDA = (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    )
  )[0];

  const metadataInstruction = mplTokenMetadata.createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintKeypair.publicKey,
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: name.trim(),
          symbol: symbol.trim(),
          uri: metadataUri.trim(),
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: !immutable,
        collectionDetails: null,
      },
    }
  );

  transaction.add(metadataInstruction);

  if (revokeMintAuthority) {
    transaction.add(
      createSetAuthorityInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        AuthorityType.MintTokens,
        null
      )
    );
  }

  if (freezeAuthority && revokeFreezeAuthority) {
    transaction.add(
      createSetAuthorityInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        AuthorityType.FreezeAccount,
        null
      )
    );
  }

  const signature = await wallet.sendTransaction(transaction, connection, {
    signers: [mintKeypair],
  });

  console.log("Mint + Metadata Transaction Signature:", signature);
}