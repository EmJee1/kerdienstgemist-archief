import * as functions from 'firebase-functions'
import { getKDGServices } from './utils/kdg-helpers'
import {
	getServiceFileName,
	serviceProcessingFlow,
} from './utils/web-file-helpers'

export const syncRecentServices = functions.pubsub
	.schedule('59 23 * * 7')
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
