const { OpenAI, ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { ExcelHandler } = require('./excel');
const GovOccupations = require('./gov-occupations')
const PromptHandler = require('./prompts')

const {
    RunnableSequence,
    RunnablePassthrough,
  } = require("@langchain/core/runnables");
require('dotenv').config({ path: '../../.env' });
const apiKey = process.env.OPENAI_API_KEY;
  

class LangChainPrompting {
    constructor(apiKey, model) {
      this.excelHandler = new ExcelHandler();
      this.llm = new ChatOpenAI({
        apiKey: apiKey,
        model: "gpt-4"
      });

    }
  

    async prompting(prompts){
      var occupation = "Lawyers"
      var tasks = await GovOccupations.getGovTask(occupation)
      occupation = occupation.slice(0, -1); //remove "s"

      var task = tasks[0]
      var history = []
      var context = ChatPromptTemplate.fromMessages(history);
      var vars = {occupation: occupation, task : task}


      var prompt = await PromptHandler.getPrompt(1, vars)
      var result = await this.invoke(prompt,context)
      var situations = PromptHandler.splitResponse(result)


      for (let i = 0; i < situations.length; i++) {
        var situation = situations[i];
        vars.context = situation
        history.push(["user", prompt], ["system", situation])
        var context = ChatPromptTemplate.fromMessages(history);
        this.excelHandler.writeArrayToExcel(history,occupation)
        var prompt = await PromptHandler.getPrompt(2, vars)
        var result = await this.invoke(prompt,context)
        var subtasks = PromptHandler.splitResponse(result)


        for (let i = 0; i < subtasks.length; i++) {
          var subtask = subtasks[i];
          vars.subtask = subtask
          this.excelHandler.writeArrayToExcel(history,occupation)

          history.push(["user", prompt], ["system", subtask])
          var context = ChatPromptTemplate.fromMessages(history);
          var prompt = await PromptHandler.getPrompt(3, vars)
          var result = await this.invoke(prompt,context)
          var outputs = PromptHandler.splitResponse(result)
          for (let i = 0; i < outputs.length; i++) {
            var output = outputs[i];
            vars.output = output
            history.push(["user", prompt], ["system", output])
            var context = ChatPromptTemplate.fromMessages(history);
            var prompt = await PromptHandler.getPrompt(4, vars)
            var result = await this.invoke(prompt,context)
            history.push(["user", prompt], ["system", result])
            console.log(history)
            this.excelHandler.writeArrayToExcel(history,occupation)

            for (let i = 0; i < 2; i++){
              var prompt = await PromptHandler.getPrompt(5+i, vars)
              var result = await this.invoke(prompt,context)
              history.push(["user", prompt], ["system", result])
            }

            this.excelHandler.writeArrayToExcel(history,occupation)
            break

          }
          break

        }
        break;
      }
      
    }

    async invoke(question, context) {

      // const chatHistory = [
      //   new HumanMessage("Can LangSmith help test my LLM applications?"),
      //   new AIMessage("Yes!"),
      // ];
      
      // await historyAwareRetrieverChain.invoke({
      //   chat_history: chatHistory,
      //   input: "Tell me how!",
      // });


      const chain = context.pipe(this.llm);
      var result = await this.llm.invoke(question);
      return result.content
    }

    
  }
  

prompting = new LangChainPrompting()
prompting.prompting()