import pkg from 'jsonwebtoken';
const { sign } = pkg;


const generatetoken = (user) => {
  return sign(
    { id: user._id, role: user.role, email: user.email, name: user.name},
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export const generateToken = generatetoken