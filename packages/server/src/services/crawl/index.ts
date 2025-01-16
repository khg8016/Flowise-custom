import * as cheerio from 'cheerio'
import axios from 'axios'

const crawl = async (url: string): Promise<string> => {
    try {
        // 주어진 URL에서 HTML 가져오기
        const response = await axios.get(url)
        const html = response.data

        // cheerio를 사용하여 HTML 파싱
        const $ = cheerio.load(html)

        // 본문 내용 추출 전략
        // 텍스트 길이가 가장 긴 요소를 선택
        let maxTextLength = 0
        let mainContent = ''

        $('body *').each((i, element) => {
            const text = $(element).text().trim()
            const textLength = text.length

            if (textLength > maxTextLength) {
                maxTextLength = textLength
                mainContent = text
            }
        })

        return mainContent
    } catch (error) {
        console.error(`crawl 함수 오류: ${(error as Error).message}`)
        throw new Error('크롤링 중 오류가 발생했습니다.')
    }
}

export default {
    crawl
}
