const asyncHandler = require('express-async-handler');
const Contact = require('../db/models/contactModel');

//@desc: Get All contacts
//route: GET /api/contacts
//@access: private
const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find({ user_id: req.user.id })
	res.status(200).json(contacts);
})


//@desc: Create new contact
//route: POST /api/contacts
//@access: private

const createContact = asyncHandler(async (req, res) => {
	console.log(`the request body is: ${req.body}`)
	const { name, email, phone } = req.body;
	if (!name || !email || !phone) {
		res.status(400);
		throw new Error('All fields are mandatory');
	}
	const contact = await Contact.create({
		name, email, phone, user_id: req.user.id
	})
	res.status(201).json(contact)
})



//@desc: Get single contact
//route: GET /api/contacts/:id
//@access: private
const getContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found")
	}
	res.status(200).json(contact)
})

//@desc: Upodate contact
//route: PUT /api/contacts/:id
//@access: private

const updateContact = asyncHandler(async (req, res) => {
	const contactId = req.params.id;
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found")
	}
	if (contact.user_id.toString() !== req.user.id) {
		req.statusCode(403);
		throw new Error(`you don't have permission to update other user contacts`)
	}
	const updatedContact = await Contact.findByIdAndUpdate(
		contactId,
		req.body,
		{
			new: true
		}
	);
	res.status(201).json(updatedContact)
})


//@desc: Delete contact
//route: DELETE /api/contacts/:id
//@access: private

const deleteContact = asyncHandler(async (req, res) => {
	const contactId = req.params.id;
	const contact = await Contact.findById(req.params.id)
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found")
	}
	if (contact.user_id.toString() !== req.user.id) {
		req.statusCode(403);
		throw new Error(`you don't have permission to update other user contacts`)
	}
	await Contact.deleteOne({ _id: contactId });
	res.status(200).json(contact)
})

//@exports
module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }