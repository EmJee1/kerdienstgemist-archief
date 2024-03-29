import axios, { AxiosRequestConfig } from 'axios'
import { bucket, firestore } from '../firebase/firebase'
import { IKDGService, IService } from '../models/kerkdienst-gemist'
import { File } from '@google-cloud/storage'

export const downloadFromUrl = async (
  url: string,
  options?: AxiosRequestConfig<any>
): Promise<[any, string]> => {
  const res = await axios.get(url, {responseType: 'stream', ...options})
  if (res.status !== 200) {
    throw new Error(`Did not get a valid response from ${url}`)
  }

  return [res.data, res.headers['content-type']]
}

export const uploadFileToStorage = async (
  data: any,
  fileName: string,
  contentType: string
): Promise<[string, File]> => {
  const fileLocation = `services/audio/${fileName}`
  const file = bucket.file(fileLocation)
  const writeStream = file.createWriteStream({metadata: {contentType}})
  await data.pipe(writeStream)

  return [fileLocation, file]
}

export const getServiceFileName = (service: IKDGService) =>
  service.link.split('/')[service.link.split('/').length - 1].toLowerCase()

export const getServiceId = (service: IKDGService) =>
  getServiceFileName(service).split('-')[0]

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
    const docId = getServiceId(service)
    await firestore.collection('services').doc(docId).set(docData)
  } catch (err) {
    await file.delete()
    throw new Error(
      `Error while inserting ${service.title} from date ${service.pubDate}`
    )
  }
}

export const serviceExistsInFirestore = async (service: IKDGService) => {
  const docId = getServiceId(service)
  return (await firestore.collection('services').doc(docId).get()).exists
}

export const serviceProcessingFlow = async (service: IKDGService) => {
  const fileName = getServiceFileName(service)

  if (await serviceExistsInFirestore(service)) {
    return false
  }

  const [rawData, contentType] = await downloadFromUrl(service.enclosure.url)
  const [fileLocation, file] = await uploadFileToStorage(
    rawData,
    fileName,
    contentType
  )

  await insertServiceToFirestore(service, fileLocation, file)

  return true
}

interface GetExpirationDateProps {
  days?: number
  hours?: number
  minutes?: number
}

export const getExpirationDate = ({
	days,
	hours,
	minutes,
}: GetExpirationDateProps) => {
  const date = new Date()

  if (days) date.setDate(date.getDate() + days)
  if (hours) date.setHours(date.getHours() + hours)
  if (minutes) date.setMinutes(date.getMinutes() + minutes)

  return date
}
