import * as functions from 'firebase-functions'
import RssParser from 'rss-parser'

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
