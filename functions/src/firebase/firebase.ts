import { initializeApp } from 'firebase-admin'

const app = initializeApp()

export const firestore = app.firestore()
export const bucket = app.storage().bucket()
