import * as functions from 'firebase-functions'
import { getKDGServices } from './utils/kdg-helpers'
import { bucket } from './firebase/firebase'
import {
	getExpirationDate,
	getServiceFileName,
	serviceProcessingFlow,
} from './utils/web-file-helpers'

export const createSignedServiceDownloadUrl = functions.https.onRequest(
	async (req, res) => {
		res.header('Access-Control-Allow-Origin', '*')

		const servicePath = req.query.servicePath?.toString()

		if (!servicePath) {
			functions.logger.debug(`Requested signed url without servicePath query`)
			res.sendStatus(422)
			return
		}

		const file = bucket.file(servicePath)

		if (!(await file.exists())) {
			functions.logger.debug(`Requested service '${servicePath}' was not found`)
			res.sendStatus(404)
			return
		}

		try {
			functions.logger.info(`Creating signed url for '${servicePath}'`)

			const signedUrl = await file.getSignedUrl({
				action: 'read',
				expires: getExpirationDate({ days: 7 }),
			})

			res.json({ url: signedUrl[0] }).status(200)
		} catch (err) {
			functions.logger.error(err)
			res.sendStatus(500)
		}
	}
)

export const syncRecentServices = functions.pubsub
	.schedule('59 23 * * 7')
	.timeZone('Europe/Amsterdam')
	.onRun(async () => {
		try {
			const items = await getKDGServices(6)

			for (const item of items) {
				if (!(await serviceProcessingFlow(item))) {
					// if not processed (service already exists in firestore)
					// stop processing of remaining services, because rss feed is chronologically ordered
					break
				}

				functions.logger.info(`${getServiceFileName(item)} added`)
			}
		} catch (err) {
			functions.logger.error(err)
		}
	})
