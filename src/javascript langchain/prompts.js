const { ExcelHandler } = require('./excel');

var prompts = null
class PromptHandler {
    static async getPrompts() {
        const excelHandler = new ExcelHandler(); // Assuming ExcelHandler is defined and imported
        let prompts = await excelHandler.readExcelFile("../input/prompts.xlsx");
        prompts = prompts.map(prompt => prompt[2] + prompt[3]);
        return prompts;
    }

    static async getPrompt(i, vars = null) {
        if (!prompts){
            prompts = await PromptHandler.getPrompts(); 
        }
        const prompt = prompts[i]; 
        return prompt.replace(/\{(\w+)\}/g, (match, key) => vars[key] || match);
    }

    static splitResponse(response) {
        return response.split(/\d+\.\s/).filter(s => s.trim()).map(s => s.trim());
    }
}

module.exports = PromptHandler
