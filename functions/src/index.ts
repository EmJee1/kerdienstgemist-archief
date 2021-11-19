import * as functions from 'firebase-functions'
import { getKDGServices } from './utils/kdg-helpers'
import { serviceProcessingFlow } from './utils/web-file-helpers'

export const storeLatestService = functions.https.onRequest(
	async (req, res) => {
		res.header('Access-Control-Allow-Origin', '*')

		try {
			const item = (await getKDGServices(1))[0]

			await serviceProcessingFlow(item)

			res.json({ done: true }).status(200)
		} catch (err) {
			functions.logger.error(err)
			res.sendStatus(500)
		}
	}
)

export const storeAllServices = functions.https.onRequest(async (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')

	try {
		const items = await getKDGServices(999)

		// items.forEach(async service => await serviceProcessingFlow(service))
		res.json({ items }).status(200)
	} catch (err) {
		res.sendStatus(500)
	}
})

// run every sunday at 11:59 PM
// export const storeKerkdienstgemistService = functions.pubsub
// 	.schedule('59 23 * * 7')
// 	.onRun(async () => {
// 		const parser = new RssParser()

// 		const feed = (await parser.parseURL(`${RSS_FEED_URL}&limit=4`)) as {
// 			items: IService[]
// 		}

// 		const batch = firestore.batch()

// 		feed.items.forEach(item => {
// 			const doc = firestore.collection('services').doc()
// 			const data = {
// 				createdAt: new Date(item.pubDate),
// 				title: item.title,
// 			}
// 			batch.set(doc, data)
// 		})

// 		batch.commit()
// 	})
