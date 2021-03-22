import fs, { PathLike } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
const IpfsHttpClient = require('ipfs-http-client');
const { globSource } = IpfsHttpClient;

export async function uploadFile(filePath: PathLike): Promise<string> {
    const ipfs = IpfsHttpClient();
    for await (let item of globSource(filePath)) {
    }
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    let addResponse = await fetch('http://127.0.0.1:9094/add', {
        method: 'POST',
        body: formData,
    });
    addResponse = await addResponse.json();
    return (addResponse as any).cid['/'];
}
