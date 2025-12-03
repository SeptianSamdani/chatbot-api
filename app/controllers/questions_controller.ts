import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
import Message from '#models/message'
import axios from 'axios'
import { randomUUID } from 'node:crypto'
import { questionValidator } from '#validators/question'

export default class QuestionsController {
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(questionValidator)
      const { question, session_id } = payload

      // Validasi input
      if (!question) {
        return response.badRequest({ message: 'Question is required' })
      }

      // Generate session_id jika tidak ada
      const sessionId = session_id || randomUUID()

      // Cari atau buat conversation
      let conversation = await Conversation.findBy('session_id', sessionId)
      if (!conversation) {
        conversation = await Conversation.create({
          sessionId: sessionId,
          lastMessage: question,
        })
      }

      // Simpan pesan user
      await Message.create({
        conversationId: conversation.id,
        senderType: 'user',
        message: question,
      })

      // Request ke API eksternal
      const externalResponse = await axios.post(
        'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message',
        {
          question: question,
          additional_context: '',
          session_id: sessionId,
        }
      )

      const botMessage = externalResponse.data.data.message[0].text

      // Simpan response bot
      await Message.create({
        conversationId: conversation.id,
        senderType: 'bot',
        message: botMessage,
      })

      // Update last_message
      conversation.lastMessage = botMessage
      await conversation.save()

      return response.ok({
        session_id: sessionId,
        question: question,
        answer: botMessage,
        conversation_id: conversation.id,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to process question',
        error: error.message,
      })
    }
  }
}