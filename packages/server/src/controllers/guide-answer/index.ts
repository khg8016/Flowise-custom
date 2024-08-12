import { Request, Response, NextFunction } from 'express'
import { IncomingInput } from '../../Interface'
import runOnlyLLM from '../../services/run-llm'

// Send input message and get prediction result (Internal)
const createGuideAnswer = async (req: Request, res: Response, next: NextFunction) => {
    let incomingInput: IncomingInput = req.body

    const prompt = `
        You are an intelligent assistant specializing in generating relevant follow-up questions based on a conversation history. 
        The conversation history provided below is between a user and a GPT specialized in finding people or startups with specific conditions.
        Given the following conversation history, generate three logical and relevant follow-up questions that the user might ask next. 
        These questions should be based on the user's request to find people or startups and should help the user further refine or explore their search.

        Return the questions in a JSON format as an array of strings.

        Conversation History:
        ${incomingInput.question}

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
