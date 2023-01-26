import { initializeApp } from 'firebase-admin/app'

const { SERVICE_ACCOUNT } = process.env

initializeApp({
  serviceAccountId: SERVICE_ACCOUNT
})
