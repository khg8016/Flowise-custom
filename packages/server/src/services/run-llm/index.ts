import { ChatOpenAI } from '@langchain/openai'
import logger from '../../utils/logger'
import { SystemMessage } from '@langchain/core/messages'

const runOnlyLLM = async (prompt: string) => {
    const chain = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: 0
    })

    try {
        const result = await chain.invoke([new SystemMessage(prompt)])

        return result.content.toString().trim()
    } catch (error) {
        logger.error(error)
        return '{"questions": []}'
    }
}
export default runOnlyLLM
