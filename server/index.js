require("dotenv").config();
const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51O2Nz1Bk4o9NggAuy6wFpOHlGRiIIQqOB4zhPattU8REycMuaU0FOLCsqja6jbNcG5ya2CCJTyxYtWvQpw2Q3vAV00ESnYUJk8"
);
// console.log(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/donate", async (req, res) => {
  try {
    // Getting data from client

    let { amount } = req.query;
    console.log("amount -------> ", amount);
    amount = parseInt(amount);
    // Initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      payment_method_types: ["card"],
    });
    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({
      message: "Payment initiated",
      clientSecret,
      date: paymentIntent,
    });
  } catch (err) {
    // Catch any error and send error 500 to client
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/create-subscription", async (req, res) => {
  try {
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: "card",
    //   card: {
    //     number: req.body.last4,
    //     exp_month: req.body.expiryMonth,
    //     exp_year: req.body.expiryYear,
    //     cvc: "314",
    //   },
    // });

    const customer = await stripe.customers.create({
      payment_method: "pm_card_visa",
      invoice_settings: {
        default_payment_method: "pm_card_visa",
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: "price_1O34M9Bk4o9NggAupTwCBviu" }],
      expand: ["latest_invoice.payment_intent"],
    });
    return res.json({
      statusCode: 200,
      body: JSON.stringify({
        subscriptionID: subscription.id,
        period: subscription.latest_invoice.lines.data[0].period,
      }),
    });
    // console.log("request -> ", req.body);

    // if (req.body.last4 == "") {
    // }
    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: "card",
    //   card: {
    //     number:
    //       "sk_test_51O2Nz1Bk4o9NggAuy6wFpOHlGRiIIQqOB4zhPattU8REycMuaU0FOLCsqja6jbNcG5ya2CCJTyxYtWvQpw2Q3vAV00ESnYUJk8",
    //     exp_month: req.body.expiryMonth,
    //     exp_year: req.body.expiryYear,
    //     cvc: "314",
    //   },
    // });

    // console.log("paymentMethod -> ", paymentMethod);
    // const customer = await stripe.customers.create({
    //   payment_method: "pm_card_visa",
    //   invoice_settings: {
    //     default_payment_method: "pm_card_visa",
    //   },
    // });

    // console.log("customer -> ", customer);
    // const subscription = await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{ price: "price_1O34M9Bk4o9NggAupTwCBviu" }],
    //   expand: ["latest_invoice.payment_intent"],
    // });

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({
    //     subscriptionID: subscription.id,
    //     period: subscription.latest_invoice.lines.data[0].period,
    //   }),
    // };
  } catch (error) {
    // Catch any error and send error 500 to client
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error"),
    };
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
