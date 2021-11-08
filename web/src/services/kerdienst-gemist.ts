import axios from 'axios'
import { IService } from '../models/kerdienst-gemist'

// TODO: fix environment variables
const URL = {
	local:
		'http://localhost:5001/kerdienstgemist-archief/us-central1/kerkdienstgemistFeed',
	prod: 'https://us-central1-kerdienstgemist-archief.cloudfunctions.net/kerkdienstgemistFeed',
}

export const fetchKerdienstgemistFeed = async () =>
	(await axios.get<IService>(URL.prod)).data
