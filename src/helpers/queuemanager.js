const Queue = require("bull")
const redis = require("redis")
const axios = require("axios")

class QueueManager {
  constructor({ redisClient }) {
    this.redisClient = redisClient
    this.queue = new Queue("predictions", "redis://redis:6379") // NOTE: THE IP HAS TO BE THAT OF THE DOCKER NETWORK
    this.runMethylsight = this.runMethylsight.bind(this)
    this.queue.process("predictions", this.runMethylsight)
  }

  async runMethylsight(job, done) {
    const { proteins, requestId } = job.data
    const results = {}

    for (let i = 0; i < proteins.length; i++) {
      const { tag, sequence } = proteins[i]
      const resp = await axios.post("http://methylsight-predictor:5000/", {
        tag,
        sequence,
      })
      const { predictions } = resp.data
      results[tag] = {
        name: tag,
        accessionId: null,
        sequence: sequence,
        methylsightScores: predictions,
        regions: [], // unknown
        ptms: [], // unknown
      }
      job.progress((100 * i) / proteins.length)
    }
    this.redisClient.hmset(
      requestId,
      "status",
      "successful",
      "predictions",
      JSON.stringify(results)
    )
    done()
  }

  addJob(job) {
    this.queue.add(
      "predictions",
      {
        requestId: job.requestId,
        proteins: job.proteins,
      },
      { jobId: job.requestId }
    )
  }

  async getProgress(requestId) {
    const job = await this.queue.getJob(requestId)
    return job.progress()
  }
}

function QueueManagerCreator({ redisClient }) {
  return new QueueManager({ redisClient })
}

module.exports = QueueManagerCreator
