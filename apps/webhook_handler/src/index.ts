import express from "express";
import db from "@repo/db/client";
import { AmpContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

app.post("/bankWebhook", async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: number;
    amount: number;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };
  try {
    if (paymentInformation.userId) {
      await db.$transaction([
        db.balances.update({
          where: {
            userId: paymentInformation.userId,
          },
          data: {
            amount: {
              increment: paymentInformation.amount,
            },
          },
        }),
        db.onRampTransaction.update({
          where: {
            token: paymentInformation.token,
          },
          data: {
            status: "successful",
          },
        }),
      ]);

      res.json({
        msg: "captured",
      });
    } else {
      res.status(400).json({
        msg: "invalid user id",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(411).json({
      msg: "error occured",
    });
  }
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
