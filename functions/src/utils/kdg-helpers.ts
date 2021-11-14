import * as functions from 'firebase-functions'
import RssParser from 'rss-parser'
import { IKDGService } from '../models/kerkdienst-gemist'

const rss = {
	playlist: Number(functions.config().kerkdienstgemist.rss),
	accessKey: functions.config().kerkdienstgemist.access_key,
}

const RSS_FEED_URL = `https://kerkdienstgemist.nl/playlists/${rss.playlist}.rss?access_key=${rss.accessKey}&media=audio`

const parser = new RssParser()

export const getKDGServices = async (limit = 9): Promise<IKDGService[]> =>
	(await parser.parseURL(`${RSS_FEED_URL}&limit=${limit}`))
		.items as IKDGService[]
