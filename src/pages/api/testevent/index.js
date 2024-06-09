import connect from "../../../lib/database";

async function handler(req, res) {

	await connect();
	if (req.method == 'POST') {
		res.json(JSON.parse(
			JSON.stringify(
			{ 
					discordeventid: '100',
					intraeventid: null,
			})
		));
		res.status(200).send();
	}
}

export default handler;