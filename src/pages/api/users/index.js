import connect from "../../../lib/database";
import User from "../../../models/User";

async function handler(req, res) {

	await connect();
	const user = await User.find({});
	res.json(JSON.parse(JSON.stringify(user)));
	res.status(200).send();
}

export default handler;