import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import chatflowsService from '../../services/crawl'

// Send input message and get prediction result (External)
const createCrawl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body

        if (!url) {
            return res.status(400).json({ message: 'URL이 필요합니다.' })
        }

        const content = await chatflowsService.crawl(url)

        // 결과 반환
        res.status(200).json({
            url,
            content
        })
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `createCrawl 오류: ${(error as Error).message}`)
    }
}

export default {
    crawl: createCrawl
}
