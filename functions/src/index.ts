import * as functions from 'firebase-functions'
import RssParser from 'rss-parser'
// import { firestore } from './firebase/firebase'
// import { IService } from './models/kerkdienst-gemist'

const rss = {
	playlist: Number(functions.config().kerkdienstgemist.rss),
	accessKey: functions.config().kerkdienstgemist.access_key,
}

const RSS_FEED_URL = `https://kerkdienstgemist.nl/playlists/${rss.playlist}.rss?access_key=${rss.accessKey}&media=audio`

export const kerkdienstgemistFeed = functions.https.onRequest(
	async (req, res) => {
		res.header('Access-Control-Allow-Origin', '*')

		const parser = new RssParser()

		try {
			const feed = await parser.parseURL(RSS_FEED_URL)
			res.json(feed.items).status(200)
		} catch (err) {
			functions.logger.error('Error while parsing rss feed:', err)
			res.sendStatus(500)
		}
	}
)

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
