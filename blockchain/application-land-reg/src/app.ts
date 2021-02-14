import inquirer from 'inquirer';
import { promptAddLand } from './prompts/addLand';
import { promptQueryVillage } from './prompts/queryAllVillageRecords';
import { promptOwnershipHistory } from './prompts/queryOwnershipHistory';
import { promptSplitLand } from './prompts/splitLand';
import { promptTransferLand } from './prompts/transferLand';

async function showMenu() {
    while (true) {
        const quesMenu = {
            type: 'list',
            name: 'menu',
            message: 'What do you want to do?',
            choices: [
                { name: 'Add Land Record', value: 1 },
                { name: 'Transfer Land Ownership', value: 2 },
                { name: 'Split Land', value: 3 },
                { name: 'Query All Records in a Village', value: 4 },
                { name: 'Query Ownership History of Land', value: 5 },
                { name: 'Exit', value: 6 },
            ],
        };

        let menuChoice = await inquirer.prompt([quesMenu]);

        switch (menuChoice.menu) {
            case 1:
                await promptAddLand();
                break;
            case 2:
                await promptTransferLand();
                break;
            case 3:
                await promptSplitLand();
                break;
            case 4:
                await promptQueryVillage();
                break;
            case 5:
                await promptOwnershipHistory();
                break;
            default:
                process.exit();
        }
    }
}

showMenu();
