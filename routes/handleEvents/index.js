const axios = require('axios')
const qs = require('qs')
require('dotenv').config()

const notifyToken = process.env.LINE_NOTIFY
const lineNotifyUrl = process.env.LINE_NOTIFY_URL

const HandlerPushEvents = async function (events) {
    const gitlabProject = events.project.name
    const gitlabBranch = events.ref
    const gitlabEvent = events.event_name
    const gitlabAuthor = events.commits[0].author.name
    const gitlabTimestamp = events.commits[0].timestamp
    const gitlabCommitMessage = events.commits[0].message
    const gitlabCommitUrl = events.commits[0].url
    const httpConfig = {
        headers: {
            authorization: `Bearer ${notifyToken}`,
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
    }
    const messageResponse = {
        message:
            '\nTime: ' +
            gitlabTimestamp +
            '\nProject: ' +
            gitlabProject +
            '\nBranch: ' +
            gitlabBranch +
            '\nEvent: ' +
            gitlabEvent +
            '\nAuthor: ' +
            gitlabAuthor +
            '\nCommit: ' +
            gitlabCommitMessage +
            '\nCommit-url: ' +
            gitlabCommitUrl,
    }
    const notifyRequest = await axios.post(
        lineNotifyUrl,
        qs.stringify(messageResponse),
        httpConfig
    )
    if (notifyRequest.status !== 200) {
        throw new HttpError(`${notifyRequest.data}`)
    }
}

const HandlerMergeEvents = async function (events) {
    const gitlabProject = events.project.name
    const gitlabBranch = `${events.object_attributes.source_branch} => ${events.object_attributes.target_branch}`
    const gitlabEvent = events.object_kind
    const gitlabAuthor = events.user.name
    const gitlabTimestamp = events.object_attributes.created_at
    const gitlabCommitMessage = events.object_attributes.title
    const gitlabCommitUrl = events.object_attributes.url
    const httpConfig = {
        headers: {
            authorization: `Bearer ${notifyToken}`,
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
    }
    const messageResponse = {
        message:
            '\nTime: ' +
            gitlabTimestamp +
            '\nProject: ' +
            gitlabProject +
            '\nBranch: ' +
            gitlabBranch +
            '\nEvent: ' +
            gitlabEvent +
            '\nAuthor: ' +
            gitlabAuthor +
            '\nCommit: ' +
            gitlabCommitMessage +
            '\nCommit-url: ' +
            gitlabCommitUrl,
    }
    const notifyRequest = await axios.post(
        lineNotifyUrl,
        qs.stringify(messageResponse),
        httpConfig
    )
    if (notifyRequest.status !== 200) {
        throw new HttpError(`${notifyRequest.data}`)
    }
}

const HandlerPipelineEvents = async function (events) {
    const gitlabProject = events.project.name
    const gitlabBranch = events.object_attributes.ref
    const gitlabEvent = `${events.object_kind} => status: ${events.object_attributes.status}`
    const gitlabAuthor = events.user.name
    const gitlabTimestamp = events.object_attributes.created_at
    const gitlabCommitMessage = events.commit.title
    const gitlabCommitUrl = events.commit.url
    const httpConfig = {
        headers: {
            authorization: `Bearer ${notifyToken}`,
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
    }
    const messageResponse = {
        message:
            '\nTime: ' +
            gitlabTimestamp +
            '\nProject: ' +
            gitlabProject +
            '\nBranch: ' +
            gitlabBranch +
            '\nEvent: ' +
            gitlabEvent +
            '\nAuthor: ' +
            gitlabAuthor +
            '\nCommit: ' +
            gitlabCommitMessage +
            '\nCommit-url: ' +
            gitlabCommitUrl,
    }
    const notifyRequest = await axios.post(
        lineNotifyUrl,
        qs.stringify(messageResponse),
        httpConfig
    )
    if (notifyRequest.status !== 200) {
        throw new HttpError(`${notifyRequest.data}`)
    }
}

module.exports = {
    HandlerPushEvents,
    HandlerMergeEvents,
    HandlerPipelineEvents,
}
