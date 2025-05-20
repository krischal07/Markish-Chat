// import jwt from "jsonwebtoken"
// import User from "../models/user.model.js"

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return next({
//         status: 401,
//         message: "Unauthorized - No Token Provided!"
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     if (!decoded) {
//       return next({
//         status: 401,
//         message: "Unauthorized - Token Invalid!"
//       });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return next({
//         status: 404,
//         message: "User not found!!"
//       });
//     }

//     // Attach user to request object
//     req.user = user;
    
//     // Pass control to next middleware/route handler
//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware:", error.message);
//     return next({
//       status: 500,
//       message: "Internal Server Error"
//     });
//   }
// };




import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};