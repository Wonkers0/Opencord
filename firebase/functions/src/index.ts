/* eslint-disable */
import functions = require("firebase-functions");
import admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

exports.onUserStatusChanged = functions.database.ref("/status/{uid}").onUpdate(
    async (change: any, context: any) => {
      const eventStatus = change.after.val();

      const userRef = firestore.doc(`users/${context.params.uid}`);

      const userData = (await userRef.get()).data();
      
      if (userData?.last_changed > eventStatus.last_changed) return null;
      

      eventStatus.last_changed = admin.firestore.FieldValue.serverTimestamp();

      if(eventStatus.status == "online") eventStatus.status = userData?.userStatus;
      else eventStatus.status = 3
      

      return userRef.set(eventStatus, {merge: true});
    });
