import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { config as configEnv } from 'dotenv'
import RssParser from 'rss-parser'
import axios from 'axios'
import fs from 'fs'

const serviceAccountKey = JSON.parse(
	fs.readFileSync('./service-account-file.json')
)

configEnv()
initializeApp({
	credential: cert(serviceAccountKey),
	storageBucket: 'kerdienstgemist-archief.appspot.com',
})
const firestore = getFirestore()
const bucket = getStorage().bucket()

const parser = new RssParser()
const firestoreBatch = []

const downloadFromUrl = async (url, options) => {
	try {
		const res = await axios.get(url, { responseType: 'stream', ...options })

		if (res.status !== 200) {
			throw new Error(`Did not get a valid response from ${url}`)
		}

		return [res.data, res.headers['content-type']]
	} catch (err) {
		throw err
	}
}

const uploadFileToStorage = async (data, fileName, contentType) => {
	try {
		const fileLocation = `services/audio/${fileName}`
		const file = bucket.file(fileLocation)
		const writeStream = file.createWriteStream({ metadata: { contentType } })
		await data.pipe(writeStream)

		return [fileLocation, file]
	} catch (err) {
		throw err
	}
}

const getServiceFileName = service =>
	service.link.split('/')[service.link.split('/').length - 1].toLowerCase()

const getServiceId = service => getServiceFileName(service).split('-')[0]

const insertServiceToFirestore = async (service, location, file) => {
	const docData = {
		title: service.title,
		file: location,
		createdAt: new Date(service.pubDate),
	}

	try {
		const docId = getServiceId(service)
		await firestore.collection('services').doc(docId).set(docData)
	} catch (err) {
		await file.delete()
		throw new Error(
			`Error while inserting ${service.title} from date ${service.pubDate}`
		)
	}
}

const fetchServices = async () =>
	(await parser.parseURL(`${process.env.RSS_FEED}&limit=999`)).items

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const run = async () => {
	const services = await fetchServices()

	let totalIterations = services.length

	let iteration = 1
	for (const service of services) {
		const fileName = getServiceFileName(service)

		try {
			const [rawData, contentType] = await downloadFromUrl(
				service.enclosure.url
			)
			const [fileLocation, file] = await uploadFileToStorage(
				rawData,
				fileName,
				contentType
			)

			firestoreBatch.push({ service, fileLocation, file })

			console.log(`Storage upload: ${iteration} / ${totalIterations}`)

			await sleep(100)
		} catch (err) {
			console.log(`Error at iteration ${iteration}:`)
			console.log(err)
		}

		iteration++
	}

	let batchIteration = 1
	for (const batchItem of firestoreBatch) {
		insertServiceToFirestore(
			batchItem.service,
			batchItem.fileLocation,
			batchItem.file
		)
		console.log(`Firestore insert: ${batchIteration} / ${totalIterations}`)
		batchIteration++
	}
}

run()
