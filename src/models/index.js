import sequelize from "../../db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  fullName: { type: DataTypes.STRING, defaultValue: "" },
  emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  avatar: { type: DataTypes.STRING },
});

const UserInfo = sequelize.define("user_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.NUMBER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  cvUrl: { type: DataTypes.STRING },
  info: { type: DataTypes.TEXT("long") },
  city: { type: DataTypes.STRING },
  industryId: { type: DataTypes.NUMBER },
  scheduleType: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.NUMBER },
});

const Company = sequelize.define("company", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING, allowNull: false },
  mail: { type: DataTypes.STRING, allowNull: false },
  backgroundImage: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  minWorkes: { type: DataTypes.NUMBER, allowNull: false },
  maxWorkes: { type: DataTypes.NUMBER, allowNull: false },
  location: { type: DataTypes.TEXT("long"), allowNull: false },
  description: { type: DataTypes.TEXT("long") },
});

const Job = sequelize.define("job", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT("long") },
  city: { type: DataTypes.STRING },
  salary: { type: DataTypes.NUMBER },
  scheduleType: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  companyId: { type: DataTypes.NUMBER, allowNull: false },
  industryId: { type: DataTypes.NUMBER, allowNull: false },
  allowStudents: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const JobView = sequelize.define("job_view", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.NUMBER, allowNull: false },
  jobId: { type: DataTypes.NUMBER, allowNull: false },
});

const JobApply = sequelize.define("job_apply", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.NUMBER, allowNull: false },
  jobId: { type: DataTypes.NUMBER, allowNull: false },
});

const Pricing = sequelize.define("pricing", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.NUMBER, allowNull: false },
  maxJobCount: { type: DataTypes.STRING, allowNull: false },
});

const Review = sequelize.define("review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.NUMBER, allowNull: false },
  rate: { type: DataTypes.NUMBER, allowNull: false },
  text: { type: DataTypes.TEXT("medium"), allowNull: false },
});

export { User, Company, Job, JobView, Pricing, Review, UserInfo, JobApply };
