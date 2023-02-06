import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getStorage} from 'firebase-admin/storage'
import {config as configEnv} from 'dotenv'
import RssParser from 'rss-parser'
import fs from "fs/promises";
import {downloadFromUrl, uploadFileToStorage} from "./utils.js";

configEnv()

const serviceAccountFile = await fs.readFile('service-account-file.json', {encoding: 'utf-8'})
initializeApp({
    credential: cert(JSON.parse(serviceAccountFile)),
    storageBucket: 'kerdienstgemist-archief.appspot.com',
})

const parser = new RssParser()
const firestore = getFirestore()
const bucket = getStorage().bucket()

console.log('Querying Firestore for all services')
const snapshot = await firestore.collection('services').orderBy('createdAt', 'desc').get()
console.log(`Queried ${snapshot.size} services from Firestore`)

console.log(`Fetching RSS feed with all services`)
const rssFeedServices = (await parser.parseURL(`${process.env.RSS_FEED}&limit=999`)).items
console.log(`Fetched ${rssFeedServices.length} services from RSS feed`)

const servicesToUpload = []

console.log('Checking documents without associated file in storage')
for (const doc of snapshot.docs) {
    const service = {...doc.data(), id: doc.id}
    const file = bucket.file(service.file)
    const [exists] = await file.exists()
    if (!exists) {
        servicesToUpload.push(service)
    }
}

console.log(`Found ${servicesToUpload.length} service(s) without associated file in storage`)

for (const service of servicesToUpload) {
    const feedService = rssFeedServices.find(feedService => {
        const filename = feedService.link.split('/').at(-1)
        const [id] = filename.split('-')
        return id === service.id
    })

    if (!feedService) {
        console.warn(`Feed entry for ${service.title} not found`)
        continue
    }

    console.log(`Attempting download for ${service.title} - ${feedService.pubDate}`)
    const [data, contentType] = await downloadFromUrl(feedService.enclosure.url)
    console.log(`Download completed, attempting upload`)
    await uploadFileToStorage(data, bucket, service.file, contentType)
    console.log(`Upload successful`)
}
