import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
import { conversationQueryValidator } from '#validators/conversation_query'

export default class ConversationsController {
  async index({ request, response }: HttpContext) {
    try {
      const { page = 1, limit = 10, sessionId } = await request.validateUsing(conversationQueryValidator)

      const query = Conversation.query()

      // Filter by session_id
      if (sessionId) {
        query.where('session_id', sessionId)
      }

      const conversations = await query.orderBy('updated_at', 'desc').paginate(page, limit)

      return response.ok(conversations)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch conversations',
        error: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const conversation = await Conversation.query()
        .where('id', params.id)
        .orWhere('session_id', params.id)
        .preload('messages', (query) => {
          query.orderBy('created_at', 'asc')
        })
        .firstOrFail()

      return response.ok(conversation)
    } catch (error) {
      return response.notFound({
        message: 'Conversation not found',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const message = await Message.findOrFail(params.messageId)
      await message.delete()

      return response.ok({
        message: 'Message deleted successfully',
      })
  } catch (error) {
    return response.notFound({
      message: 'Message not found',
    })
    }
  }
}