import { Request, Response, NextFunction } from 'express'
import { IncomingInput } from '../../Interface'
import runOnlyLLM from '../../services/run-llm'
import chatflowsService from '../../services/chatflows'

// Send input message and get prediction result (Internal)
const createGuideAnswer = async (req: Request, res: Response, next: NextFunction) => {
    let incomingInput: IncomingInput = req.body

    const chatflow = await chatflowsService.getChatflowById(req.params.id)
    if (!chatflow) {
        return res.status(404).send(`Chatflow ${req.params.id} not found`)
    }

    const chatbotConfig = JSON.parse(chatflow.chatbotConfig)
    const prompt = `
        You are an intelligent assistant specializing in generating relevant follow-up questions for user based on a conversation history. 
        ${chatbotConfig.followupQuestionPrompt}
        
        Conversation History:
        ----
        ${incomingInput.question}
        ----

        Return the questions in a JSON format as an array of strings.

        Example Response:
        {
            "questions": [
                "First relevant follow-up question the user might ask next in Korean.",
                "Second relevant follow-up question the user might ask next in Korean.",
                "Third relevant follow-up question the user might ask next in Korean."
            ]
        }
        Response in JSON format (do not include the ${'```'}json${'```'} syntax):        
    `
    try {
        const apiResponse = await runOnlyLLM(prompt)
        return res.json(apiResponse)
    } catch (error) {
        // next(error)
    }
}

export default {
    createGuideAnswer: createGuideAnswer
}
