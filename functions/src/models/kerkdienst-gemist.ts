export interface IServiceEnclosure {
	length: number
	type: string
	url: string
}

export interface IServiceItunes {
	summary: string
	duration: string
}

export interface IService {
	title: string
	link: string
	pubDate: string
	enclosure: IServiceEnclosure
	content: string
	contentSnippet: string
	guid: string
	isoDate: string
	itunes: IServiceItunes
}
