import { addLand } from './transactions/addLand';
import { transferLand } from './transactions/transferLand';

const landRecords = [
    {
        khasraNo: '12',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        polygonPoints: [
            {
                lat: 30.240847,
                lon: 76.674425,
            },
            {
                lat: 30.24094,
                lon: 76.676024,
            },
            {
                lat: 30.239642,
                lon: 76.676121,
            },
            {
                lat: 30.239725,
                lon: 76.674329,
            },
        ],
        area: 1200,
        khataNo: 12,
        ownerName: 'Jane Doe',
    },
    {
        khasraNo: '13',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        polygonPoints: [
            {
                lat: 30.239994,
                lon: 76.679735,
            },
            {
                lat: 30.239892,
                lon: 76.681184,
            },
            {
                lat: 30.23878,
                lon: 76.681291,
            },
            {
                lat: 30.23891,
                lon: 76.679671,
            },
        ],
        area: 1200,
        khataNo: 12,
        ownerName: 'Jane Doe',
    },
];

const landTransfers = [
    {
        khasraNo: '12',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        currentKhataNo: 12,
        currentOwnerName: 'Jane Doe',
        newKhataNo: 13,
        newOwnerName: 'Jane Doe 2',
        price: 200,
    },
    {
        khasraNo: '12',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        currentKhataNo: 13,
        currentOwnerName: 'Jane Doe 2',
        newKhataNo: 14,
        newOwnerName: 'Jane Doe 3',
        price: 300,
    },
    {
        khasraNo: '12',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        currentKhataNo: 14,
        currentOwnerName: 'Jane Doe 3',
        newKhataNo: 15,
        newOwnerName: 'Jane Doe 4',
        price: 200,
    },
    {
        khasraNo: '12',
        village: 'landiali',
        subDistrict: 'ambala',
        district: 'ambala',
        state: 'haryana',
        currentKhataNo: 15,
        currentOwnerName: 'Jane Doe 4',
        newKhataNo: 16,
        newOwnerName: 'Jane Doe 5',
        price: 200,
    },
];

async function main() {
    for(let i = 0; i<landRecords.length; i++) {
        const landRecord = landRecords[i];
        await addLand(
            landRecord.khasraNo,
            landRecord.village,
            landRecord.subDistrict,
            landRecord.district,
            landRecord.state,
            landRecord.polygonPoints,
            landRecord.area,
            landRecord.khataNo,
            landRecord.ownerName,
        );

    }

    for(let i = 0; i<landTransfers.length; i++) {
        const landTransfer = landTransfers[i];
        
        await transferLand(
            landTransfer.khasraNo,
            landTransfer.village,
            landTransfer.subDistrict,
            landTransfer.district,
            landTransfer.state,
            landTransfer.currentKhataNo,
            landTransfer.currentOwnerName,
            landTransfer.newKhataNo,
            landTransfer.newOwnerName,
            landTransfer.price,
        );
    }
}
main();
