/*
 * Stripe API Credentials.
 */

const stripe = require("stripe")(process.env.STRIPE_PUBLIC);
const genToken = async (card) =>
  await stripe.tokens.create({
    card,
  });

module.exports = genToken;
