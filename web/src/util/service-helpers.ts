import { IService } from '../models/kerdienst-gemist'

export const getServiceFileName = (service: IService) =>
	service.file.split('/')[service.file.split('/').length - 1].toLowerCase()

export const getServiceId = (service: IService) =>
	getServiceFileName(service).split('-')[0]
