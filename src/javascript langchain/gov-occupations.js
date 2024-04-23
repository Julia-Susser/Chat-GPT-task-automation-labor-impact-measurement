const fs = require('fs'); // Assuming you're using Node.js file system module

class GovOccupations {
    static async getGovTask(occupation) {
        const allOccupations = await GovOccupations.getGovData();
        const occ_tasks = allOccupations.filter(row => row.Title === occupation);
        const gov_tasks = occ_tasks.map(row => row.Task);
        return gov_tasks;
    }

    static async getGovData() {
        const csvData = fs.readFileSync('../input/Task Statements.csv', 'utf8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, key, index) => {
                obj[key.trim()] = values[index].trim();
                return obj;
            }, {});
        });
        return data;
    }
}

module.exports = GovOccupations;
