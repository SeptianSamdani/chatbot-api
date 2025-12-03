import router from '@adonisjs/core/services/router'

const QuestionsController = () => import('#controllers/questions_controller')
const ConversationsController = () => import('#controllers/conversations_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Questions routes
router.post('/questions', [QuestionsController, 'store'])

// Protected routes
router.group(() => {
  router.get('/conversations', [ConversationsController, 'index'])
  router.get('/conversations/:id', [ConversationsController, 'show'])
  router.delete('/conversations/:id/messages/:messageId', [ConversationsController, 'destroy'])
}).use(middleware.auth())