import fetch from 'node-fetch';

export default async function deleteFile(cid: string) {
    await (await fetch(process.env.IPFS_CLUSTER + '/pins/' + cid, {
        method: 'DELETE',
    })).json();
}
