import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// const functions = require('firebase-functions')
// const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.scheduledTick = functions.pubsub
  .schedule('* * * * *')
  .onRun(async (context) => {
    const writeResult = await admin
      .firestore()
      .collection('ticks')
      .add({ symbol: 'DOOM', price: 100 })
    console.log('Tick!', context, writeResult)

    return null
  })
