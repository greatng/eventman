import passport from "passport";
import connect from "../../../lib/database";
import "../../../lib/passport";

async function handler(req, res, next) {
  await connect();
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
	prompt: 'select_account',
  })(req, res, next);
}

export default handler;