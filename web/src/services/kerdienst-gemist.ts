import axios from 'axios'
import { IService } from '../models/kerdienst-gemist'

// TODO: fix environment variables
const URL =
	'http://localhost:5001/kerdienstgemist-archief/us-central1/kerkdienstgemistFeed'

export const fetchKerdienstgemistFeed = async () =>
	(await axios.get<IService>(URL)).data
