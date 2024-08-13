import client from './client'

const sendMessageAndGetFollowupQuestion = (id, input) => client.post(`/guide-answer/${id}`, input)

export default {
    sendMessageAndGetFollowupQuestion
}
