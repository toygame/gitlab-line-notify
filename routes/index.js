const express = require('express')
const router = express.Router()
const qs = require('qs')
const axios = require('axios')
require('dotenv').config()

const notifyToken = process.env.LINE_NOTIFY
const lineNotifyUrl = process.env.LINE_NOTIFY_URL
const secretToken = process.env.GITLAB_TOKEN

async function HandlerPushEvents(events) {
  const gitlabProject = events.project.name
  const gitlabBranch = events.ref
  const gitlabEvent = events.event_name
  const gitlabAuthor = events.commits[0].author.name
  const gitlabTimestamp = events.commits[0].timestamp
  const gitlabCommitMessage = events.commits[0].message
  const gitlabCommitUrl = events.commits[0].url
  const httpConfig = {
    headers: {
      'authorization': `Bearer ${notifyToken}`,
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  const messageResponse = {
    message:
      '\nTime: ' + gitlabTimestamp +
      '\nProject: ' + gitlabProject +
      '\nBranch: ' + gitlabBranch +
      '\nEvent: ' + gitlabEvent +
      '\nAuthor: ' + gitlabAuthor +
      '\nCommit: ' + gitlabCommitMessage +
      '\nCommit-url: ' + gitlabCommitUrl
  }
  const notifyRequest = await axios.post(lineNotifyUrl, qs.stringify(messageResponse), httpConfig)
  if (notifyRequest.status !== 200) {
    throw new HttpError(`${notifyRequest.data}`)
  }
}

async function HandlerMergeEvents(events) {
  const gitlabProject = events.project.name
  const gitlabBranch = `${events.object_attributes.source_branch} => ${events.object_attributes.target_branch}`
  const gitlabEvent = events.object_kind
  const gitlabAuthor = events.user.name
  const gitlabTimestamp = events.object_attributes.created_at
  const gitlabCommitMessage = events.object_attributes.title
  const gitlabCommitUrl = events.object_attributes.url
  const httpConfig = {
    headers: {
      'authorization': `Bearer ${notifyToken}`,
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  const messageResponse = {
    message:
      '\nTime: ' + gitlabTimestamp +
      '\nProject: ' + gitlabProject +
      '\nBranch: ' + gitlabBranch +
      '\nEvent: ' + gitlabEvent +
      '\nAuthor: ' + gitlabAuthor +
      '\nCommit: ' + gitlabCommitMessage +
      '\nCommit-url: ' + gitlabCommitUrl
  }
  const notifyRequest = await axios.post(lineNotifyUrl, qs.stringify(messageResponse), httpConfig)
  if (notifyRequest.status !== 200) {
    throw new HttpError(`${notifyRequest.data}`)
  }
}

async function HandlerPipelineEvents(events) {
  const gitlabProject = events.project.name
  const gitlabBranch = events.object_attributes.ref
  const gitlabEvent = `${events.object_kind} => status: ${events.object_attributes.status}`
  const gitlabAuthor = events.user.name
  const gitlabTimestamp = events.object_attributes.created_at
  const gitlabCommitMessage = events.commit.title
  const gitlabCommitUrl = events.commit.url
  const httpConfig = {
    headers: {
      'authorization': `Bearer ${notifyToken}`,
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  const messageResponse = {
    message:
      '\nTime: ' + gitlabTimestamp +
      '\nProject: ' + gitlabProject +
      '\nBranch: ' + gitlabBranch +
      '\nEvent: ' + gitlabEvent +
      '\nAuthor: ' + gitlabAuthor +
      '\nCommit: ' + gitlabCommitMessage +
      '\nCommit-url: ' + gitlabCommitUrl
  }
  const notifyRequest = await axios.post(lineNotifyUrl, qs.stringify(messageResponse), httpConfig)
  if (notifyRequest.status !== 200) {
    throw new HttpError(`${notifyRequest.data}`)
  }
}

router.post('/traceability-repo', async (req, res, next) => {
  const tokenHeader = req.headers['x-gitlab-token']
  const body = req.body
  const eventType = body.object_kind
  if (tokenHeader !== secretToken) {
    res.status(500).json({ status: 'error' })
  } else {
    switch (eventType) {
      case 'push':
        await HandlerPushEvents(body)
        break

      case 'pipeline':
        await HandlerPipelineEvents(body)
        break

      case 'merge_request':
        await HandlerMergeEvents(body)
        break

      default:
        break
    }
    return res.status(200).json({ status: 'ok' })
  }
})

module.exports = router
