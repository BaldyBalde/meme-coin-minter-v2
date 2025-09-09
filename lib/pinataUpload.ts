import axios from "axios";

export async function uploadToPinata(file: File, name: string, symbol: string) {
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!;

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name,
    keyvalues: { symbol }
  });
  formData.append("pinataMetadata", metadata);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    maxContentLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}