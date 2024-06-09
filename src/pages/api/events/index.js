import connect from "../../../lib/database";
import Event from "../../../models/Event";

async function deleteEvent(eventId, discordEventId, intraEventId) {
	console.log('deleteEvent fn', eventId, discordEventId, intraEventId)
	try {
		const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				},
			body: JSON.stringify({
				discordeventid: discordEventId,
				intraeventid: intraEventId
			})
		})
		return await response.json();
	}
	catch (err) {
		console.error('error: ', err);
		throw new Error(err);
	// console.log(eventProp.eventid, eventProp.discordeventid, eventProp.intraeventid);
	}
}
	
async function savePostEvent(eventId, intraEventId, discordEventId) {
	console.log(intraEventId, discordEventId);
	intraEventId ? intraEventId : null;
	discordEventId ? discordEventId : null;
	if (!intraEventId && !discordEventId)
		throw new Error('Failed to post on both Channel');
	await Event.findByIdAndUpdate(eventId, { 
		intraeventid: intraEventId,
		discordeventid: discordEventId,
		postintra: intraEventId ? true : false,
		postdiscord: discordEventId ? true : false
	})
		.exec();
}

// call backend API to post Event on discord
async function relayEvent(eventId, postDiscord, postIntra) {
	try {
		// console.log(postDiscord, postIntra);
		const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				},
			body: JSON.stringify({
			event_id: eventId,
			intra: postIntra,
			discord: postDiscord })
		})
		return await response.json();
	}
	catch (err) {
		throw new Error(err);
	}
}

// Save event detail in DB and call Backend API (see above)
// If it failed to post on Discord somehow (err or not return 200)
// it will delete event entries in DB
async function handler(req, res) {
	
	await connect();
	const method = req.method;
	// console.log(method);
	// console.log(req.body);
	if (method == 'GET') {
		const eventData = await Event.find({}).exec();
		res.status(200);
		res.json(JSON.parse(JSON.stringify(eventData)));
	} else if (method == 'POST') {
		const body = req.body;
		const newEvent = new Event(body);
		console.log(newEvent);
		await newEvent.save();
		if (body.postdiscord || body.postintra) {
			try {
				// console.log(newEvent._id, body.postdiscord, body.postintra);
				const responseJSON = await relayEvent(newEvent._id,
					body.postdiscord,
					body.postintra
					);
				console.log(responseJSON);
				await savePostEvent(newEvent._id,
					responseJSON.intraeventid,
					responseJSON.discordeventid
					);
				res.status(200);
				res.send({ message: "Post success"});
			} catch (err) {
				console.error(err);
				await Event.findByIdAndDelete(newEvent._id).exec();
				res.status(503);
				res.send({ message: "Post failed"});
			}
		}
		else {
			res.status(200);
			res.send({ message: 'New event save successfully'});
		}
	} else if (method == 'DELETE') {
		const body = req.body;
		try {
			// const eventEntry = await Event.findById(body.eventid);
			console.log(body);
			const responseJSON = await deleteEvent(
				body.eventid,
				body.discordeventid,
				body.intraeventid,
			)
			console.log(responseJSON);
			if (responseJSON.discorddeleted && responseJSON.intradeleted) {
				await Event.findByIdAndDelete(body.eventid).exec();
				res.status(200);
				res.send();
			} else {
				res.status(500);
				res.send({ message: 'Delete error'});
			}
		} catch (err) {
			res.status(500);
			res.send({ message: 'Delete error'});
		}
	} else {
		res.status(400)
		res.send({ message: 'method not allowed'});
	}
}

export default handler;