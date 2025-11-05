import ServerError from "../errors/ServerError.js";
import Student from "./models/studentModel.js";
import Parent from "./models/parentModel.js";
import Teacher from "./models/teacherModel.js";
import Department from "./models/deptModel.js";
import Club from "./models/clubModel.js";

export const userTypeModels = {
  0: Student,
  1: Parent,
  2: Teacher,
  3: Department,
  4: Club,
};

const getModelFromUserType = (userType) => {
  const Model = userTypeModels[userType];
  if (!Model) {
    throw new ServerError(400, `Invalid user type: ${userType}`);
  }
  return Model;
};

export default getModelFromUserType;
