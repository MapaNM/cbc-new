import Student from "../models/student.js";

export function getStudents(req, res){

	Student.find()
		.then((student) => {
			res.json(student);
		})
		.catch(() => {
			res.json({
				message: "Failed to fetch students",
			});
		});
	}

export function createStudent (req, res){
	if(req.user == null){
		res.status(403).json({
			message: "You must be logged in to create a student"
		})
		return
	}
	if(req.user.role != "admin"){
		res.status(403).json({
			message: "You must be an admin to create a student"
		})
		return
	}

	const student = new Student({
		name: req.body.name,
		age: req.body.age,
		email: req.body.email,
	});

	student
		.save()
		.then(() => {
			res.json({
				message: "Logged successfully",
			});
		})
		.catch(() => {
			console.log("Failed to Logg");
		});
}