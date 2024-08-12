import client from './client'

const sendMessageAndGetGuideAnswer = (id, input) => client.post(`/guide-answer/${id}`, input)

export default {
    sendMessageAndGetGuideAnswer
}
