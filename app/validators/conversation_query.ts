import vine from '@vinejs/vine'

export const conversationQueryValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
    session_id: vine.string().trim().optional(),
  })
)