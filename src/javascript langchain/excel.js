const ExcelJS = require('exceljs');

class ExcelHandler {
    constructor() {
        this.filePath = '../output/tasks-langchain.xlsx'
        this.workbook = new ExcelJS.Workbook();
        this.loadWorkbook()
        
    }

    async loadWorkbook(filePath) {
        try {
            await this.workbook.xlsx.readFile(this.filePath);
        } catch (error) {
        }
    }

    
   async writeArrayToExcel(data, sheetname) {
        var worksheet = this.workbook.getWorksheet(sheetname);
        if (!worksheet) {
            worksheet = this.workbook.addWorksheet(sheetname);
        }
       
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                worksheet.getCell(rowIndex + 1, cellIndex + 1).value = cell;
            });
        });

        await this.save()
    }

    async save() {
        await this.workbook.xlsx.writeFile(this.filePath);
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
