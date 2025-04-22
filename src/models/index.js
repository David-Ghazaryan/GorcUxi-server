import sequelize from '../../db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  fullName: { type: DataTypes.STRING, defaultValue: '' },
  emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  avatar: { type: DataTypes.STRING },
});

const UserInfo = sequelize.define('user_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  cvUrl: { type: DataTypes.STRING },
  info: { type: DataTypes.TEXT('long') },
  city: { type: DataTypes.STRING },
  industryId: { type: DataTypes.INTEGER },
  scheduleType: { type: DataTypes.STRING },
  salary: { type: DataTypes.INTEGER },
});

const Industry = sequelize.define('industry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
});

const Company = sequelize.define('company', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING, allowNull: false },
  mail: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  backgroundImage: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
  minWorkes: { type: DataTypes.INTEGER, allowNull: false },
  maxWorkes: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.TEXT('long'), allowNull: false },
  description: { type: DataTypes.TEXT('long') },
  userId: { type: DataTypes.INTEGER },
  webSite: { type: DataTypes.STRING },
  industryId: { type: DataTypes.INTEGER },
});

const Job = sequelize.define('job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT('long') },
  city: { type: DataTypes.STRING },
  salary: { type: DataTypes.INTEGER },
  scheduleType: { type: DataTypes.STRING, allowNull: false },
  level: { type: DataTypes.STRING, allowNull: false },
  companyId: { type: DataTypes.INTEGER, allowNull: false },
  industryId: { type: DataTypes.INTEGER, allowNull: false },
  allowStudents: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const JobView = sequelize.define('job_view', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
});

const JobApply = sequelize.define('job_apply', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userIP: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
});

const Pricing = sequelize.define('pricing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  maxJobCount: { type: DataTypes.STRING, allowNull: false },
});

const Review = sequelize.define('review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT('medium'), allowNull: false },
  stars: { type: DataTypes.FLOAT, allowNull: false },
});

// User and UserInfo (One-to-One)
User.hasOne(UserInfo, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  as: 'info',
});
UserInfo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and JobApply (One-to-Many)
User.hasMany(JobApply, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  as: 'applications',
});
JobApply.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User and Review (One-to-Many)
User.hasMany(Review, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  as: 'reviews',
});
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Company and Job (One-to-Many)
Company.hasMany(Job, {
  foreignKey: 'companyId',
  onDelete: 'CASCADE',
  as: 'jobs',
});
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Job and JobView (One-to-Many)
Job.hasMany(JobView, { foreignKey: 'jobId', onDelete: 'CASCADE', as: 'views' });
JobView.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Job and JobApply (One-to-Many)
Job.hasMany(JobApply, {
  foreignKey: 'jobId',
  onDelete: 'CASCADE',
  as: 'applications',
});
JobApply.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// Industry and Job (One-to-Many)
Industry.hasMany(Job, {
  foreignKey: 'industryId',
  as: 'jons',
});
Job.belongsTo(Industry, { foreignKey: 'jobId', as: 'industry' });

// Company and Industry (One-to-Many)
Company.belongsTo(Industry, {
  foreignKey: 'industryId',
  as: 'industry',
});

Industry.hasMany(Company, {
  foreignKey: 'industryId',
  as: 'companies',
});

export { User, Company, Job, JobView, Pricing, Review, UserInfo, JobApply, Industry };
