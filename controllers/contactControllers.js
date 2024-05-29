const asyncHandler = require("express-async-handler");
// @desc Get all contacts
// @route GET /api/contacts
// @access public
const Contact = require("../models/contactModel");
const getContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find({ user_id: req.user.id });
	res.status(200).json(contacts);
});

// @desc create contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
	const { name, email, phone } = req.body;
	if (!name || !phone || !email) {
		res.status(400);
		throw new Error("Name and phone info are mandatory!");
	}
	const contact = await Contact.create({
		name,
		email,
		phone,
		user_id: req.user.id,
	});
	res.status(201).json(contact);
});

// @desc get contact
// @route GET /api/contacts/:id
// @access private
const getContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	res.status(200).json(contact);
});

// @desc update contact
// @route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(contact.user_id.toString()!==req.user.id){
		res.status(403);
		throw new Error("User don't have permission to update this contacts.");
	}
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	const updatedContact = await Contact.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	res.status(200).json(updatedContact);
});

// @desc delete contact
// @route DELETE /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
	const contact = await Contact.findById(req.params.id);
	if(contact.user_id.toString()!==req.user.id){
		res.status(403);
		throw new Error("User don't have permission to delete this contacts.");
	}
	if (!contact) {
		res.status(404);
		throw new Error("Contact not found");
	}
	await Contact.deleteOne({ _id: req.params.id });
	res.status(200).json(contact);
});

module.exports = {
	getContacts,
	createContact,
	updateContact,
	getContact,
	deleteContact,
};
