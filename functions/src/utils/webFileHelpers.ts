import { nanoid } from 'nanoid'
import axios, { AxiosRequestConfig } from 'axios'
import { bucket, firestore } from '../firebase/firebase'
import { IKDGService, IService } from '../models/kerkdienst-gemist'
import { File } from '@google-cloud/storage'

export const downloadFromUrl = async (
	url: string,
	options?: AxiosRequestConfig<any>
) => {
	const res = await axios.get(url, {
		responseType: 'stream',
		...options,
	})

	if (res.status !== 200) {
		throw new Error(`Did not get a valid response from ${url}`)
	}

	return {
		data: res.data,
		contentType: res.headers['content-type'],
	}
}

export const uploadFileToStorage = async (
	data: any,
	fileName: string,
	contentType: string
) => {
	const fileLocation = `services/audio/${nanoid(8)}-${fileName}`
	const file = bucket.file(fileLocation)
	const writeStream = file.createWriteStream({ metadata: { contentType } })
	await data.pipe(writeStream)

	return {
		fileLocation,
		file,
	}
}

export const insertServiceToFirestore = async (
	service: IKDGService,
	location: string,
	file: File
) => {
	const docData: IService = {
		title: service.title,
		file: location,
		createdAt: new Date(service.pubDate),
	}

	try {
		await firestore.collection('services').add(docData)
	} catch (err) {
		await file.delete()
		throw new Error(
			`Error while inserting ${service.title} from date ${service.pubDate}`
		)
	}
}

export const serviceExistsInFirestore = async () => {}
