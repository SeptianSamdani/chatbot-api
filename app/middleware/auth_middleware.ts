import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const token = request.header('Authorization')
    // Simple token validation (untuk demo)
    if (!token || token !== 'Bearer secret-token-123') {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    await next()
  }
}