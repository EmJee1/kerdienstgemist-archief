import * as functions from 'firebase-functions'
import RssParser from 'rss-parser'

const RSS_FEED_URL =
	'https://kerkdienstgemist.nl/playlists/10698.rss?access_key=DqHbrDXSfp4JdQ&media=audio'

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
