import connect from "../../../lib/database";
import User from "../../../models/User";

// Patch any modified user
// Get will return any user date if match
async function handler(req, res) {
	const userId = req.query.userid;
	const method = req.method;

	await connect();
	if (method == 'PATCH')
	{
		const { roles } = req.body;
		await User.findByIdAndUpdate(userId, { roles: roles}).exec();
		res.status(200).send();
	} else if (method == 'GET')
	{
		const user = await User.findById(userId);
		res.json(JSON.parse(JSON.stringify(user)));
		res.status(200).send();
	} 
	else {
		res.status(405).send();
	}
}

export default handler;