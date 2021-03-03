import fs, { PathLike } from 'fs';
const IpfsHttpClient = require('ipfs-http-client');
const { globSource } = IpfsHttpClient;

export async function uploadFile(filePath: PathLike) {
    const ipfs = IpfsHttpClient();
    const addResponse = await ipfs.add(globSource(filePath));
    return addResponse;
}
