import admin from 'firebase-admin'

admin.initializeApp()

export const firestore = admin.firestore()
export const bucket = admin.storage().bucket()
