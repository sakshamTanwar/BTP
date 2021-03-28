import fs, { PathLike } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadFile(filePath: PathLike): Promise<string> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    let addResponse = await fetch(process.env.IPFS_CLUSTER + '/add', {
        method: 'POST',
        body: formData,
    });
    addResponse = await addResponse.json();
    return (addResponse as any).cid['/'];
}
