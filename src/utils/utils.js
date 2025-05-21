
import users from "../models/User";


export function findUser(userEmail, password) {
  return users.find((user) => user.email === userEmail && user.password === password);
}



