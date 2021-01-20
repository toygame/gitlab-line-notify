const express = require('express')
const router = express.Router()
const event = require('./handleEvents')
require('dotenv').config()

const secretToken = process.env.GITLAB_TOKEN

router.post('/', async (req, res, next) => {
  const tokenHeader = req.headers['x-gitlab-token']
  const body = req.body
  const eventType = body.object_kind
  if (tokenHeader !== secretToken) {
    res.status(500).json({ status: 'error' })
  } else {
    switch (eventType) {
      case 'push':
        await event.HandlerPushEvents(body)
        break

      case 'pipeline':
        await event.HandlerPipelineEvents(body)
        break

      case 'merge_request':
        await event.HandlerMergeEvents(body)
        break

      default:
        break
    }
    return res.status(200).json({ status: 'ok' })
  }
})

module.exports = router
