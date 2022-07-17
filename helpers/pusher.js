/*
 * Pusher JS Service API Credentials.
 */

const Pusher = require("pusher");

const pusher = new Pusher({
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  appId: process.env.PUSHER_APP_ID,
  useTLS: true,
});

module.exports = pusher;
