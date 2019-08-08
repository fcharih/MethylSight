import { Router } from 'express';
import fs from 'fs';
import util from 'util';
import multer from 'multer';
import redis from 'redis';

import DatabaseClient from './helpers/dbclient.js';
import FileProcessor from './helpers/fileprocessor.js';
import QueueManager from './helpers/queuemanager.js';
import { generateRequestId, extractWindow } from './utils';

const readFile = util.promisify(fs.readFile)
const client = redis.createClient({ host: "redis" })
const fileProcessor = FileProcessor()
const queueManager = QueueManager({ redisClient: client })
const getAsync = util.promisify(client.hgetall).bind(client)
const upload = multer({ dest: "../uploads/" })
const entriesPath = __dirname + "/../database/data/uniprot/simple"
const dbClient = DatabaseClient({ path: entriesPath })

const routes = Router();


/**
 * GET /protein/:uniprotId
 *
 * Returns the entry for the given protein.
 */
routes.get('/protein/:uniprotId', async (req, res, next) => {
	const uniprotId = req.params.uniprotId.toUpperCase();
	const requestId = generateRequestId();
	try {
		const entry = dbClient.getEntries([uniprotId])
		client.hmset(requestId, "predictions", JSON.stringify(entry))
		return res.json({
			requestId,
			status: 'successful',
			payload: entry
		});
	} catch (e) {
		res.status(400);
		return res.json({
			requestId,
			status: 'failed',
			message: `Protein with Uniprot ID '${uniprotId}' is not in our database.`
		});
	}
});

/**
 * POST /proteins
 *
 * Returns the entry for the given protein.
 */
routes.post('/proteins', upload.single("file"), async (req, res, next) => {
	const requestId = generateRequestId()

	try {
		const file = fs.readFileSync(req.file.path, "utf-8")
		const uniprotIds = fileProcessor.extractUniprotIds(file)
		const entries = dbClient.getEntries(uniprotIds)
		client.hmset(requestId, "predictions", JSON.stringify(entries))
		return res.json({
			status: 'successful',
			requestId: requestId,
			payload: entries,
		})
	} catch (e) {
		res.status(404)
		return res.json({
			status: 'failed',
			message: e.message,
			requestId: requestId,
		})
	}
});

/**
 * POST /job
 *
 * Returns the scores for the uploaded job.
 */
routes.post(
			"/job/upload",
      upload.single("file"),
      async (req, res) => {
        const requestId = generateRequestId()

        try {
          const file = fs.readFileSync(req.file.path, "utf-8")
          const proteins = fileProcessor.extractProteins(file)

          if (proteins.length > 1000) {
            throw new Error(
              `Your file contains too many proteins. The maximum is 1000, and you provided ${
                proteins.length
              }.`
            )
          }
          client.hmset(requestId, "status", 'in progress')
          queueManager.addJob({ proteins, requestId })
          return res.json({
            status: 'in progress',
            requestId: requestId,
          })
        } catch (e) {
          res.status(400)
          return res.json({
            status: 'failed',
            message: e.message,
            requestId: requestId,
          })
        }
      }
		)


		routes.get("/job/:requestId/download", async (req, res) => {
      //TODO wrap in file processor
      const request = await getAsync(req.params.requestId)
			const predictions = JSON.parse(request.predictions)
			console.log(predictions)
			let file = "UniprotID/Name,Position,Score,Window\n"
      Object.entries(predictions).forEach(entry => {
        entry[1].methylsightScores
          .concat()
          .sort((a, b) => a.position - b.position)
          .forEach(pred => {
            const line = `${entry[0]},${pred.position},${
              pred.score
            },${extractWindow({
              position: pred.position,
              sequence: entry[1].sequence,
              padding: "_",
              width: 7,
            })}\n`
            file += line
          })
      })

      res.setHeader(
        "Content-disposition",
        `attachment; filename=${req.params.requestId}.csv`
      )
      res.setHeader("Content-type", "text/plain")
      res.charset = "UTF-8"
      res.write(file)
      res.end()
    })



routes.get("/job/:requestId", async (req, res) => {
      const { requestId } = req.params
			const request = await getAsync(requestId)
      const { status } = request
			const progress = await queueManager.getProgress(requestId)

			if(status === 'successful') {
				return res.json({ status, progress, payload: JSON.parse(request.predictions) })
			} else {
				return res.json({ status, progress })
			}
})

export default routes;
