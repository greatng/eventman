import { setCookie } from "cookies-next";
import passport from "passport";
import connect from "../../../lib/database";

async function handler(req, res, next) {
  await connect();
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${process.env.REACT_APP_BASE_URL}?a=auth_fail`);
    }

    // set cookie and send redirect
    setCookie("token", info.token, {
      req,
      res,
    });
    res.redirect(`${process.env.REACT_APP_BASE_URL}dashboard`);
  })(req, res, next);
}

export default handler;