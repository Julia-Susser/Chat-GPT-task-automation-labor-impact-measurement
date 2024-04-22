const ExcelJS = require('exceljs');

class ExcelHandler {
    constructor() {
        this.workbook = new ExcelJS.Workbook();
    }

    async loadWorkbook(filePath) {
        await this.workbook.xlsx.readFile(filePath);
    }

    getWorksheet(sheetName) {
        return this.workbook.getWorksheet(sheetName);
    }

    async addWorksheet(sheetName) {
        this.workbook.addWorksheet(sheetName);
        await this.save();
    }

    async writeRowToExcel(sheetName, rowNumber, colStart, data, bold = false) {
        const worksheet = this.workbook.getWorksheet(sheetName);
        const row = worksheet.getRow(rowNumber);
        data.forEach((item, index) => {
            const cell = row.getCell(colStart + index);
            cell.value = item;
            if (bold) {
                cell.font = { bold: true };
            }
        });
        row.commit();
        await this.save();
    }

    async save() {
        await this.workbook.xlsx.writeFile('path_to_save.xlsx');
    }

    async readExcelFile(filePath) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        var rowsList = []
        workbook.eachSheet((worksheet, sheetId) => {
            worksheet.eachRow((row, rowNumber) => {
                rowsList.push(row.values);
            });
        });

        return rowsList
    }

   
}

module.exports = { ExcelHandler };
