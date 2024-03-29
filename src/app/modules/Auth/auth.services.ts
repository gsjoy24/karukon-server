import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Admin } from '../Admin/admin.model';
import { User } from '../User/User.model';
import { TChangePassword, TLogin } from './auth.types';
import { createToken } from './auth.utils';

const loginAdmin = async (payload: TLogin) => {
  const { email, password } = payload;

  // check if the user is exist
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'The admin is not found');
  }

  // check if the password is correct
  const isPasswordMatch = await Admin.isPasswordMatched(
    password,
    admin?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials');
  }

  const jwtPayload = {
    id: admin?._id,
    email: admin?.email,
    role: 'admin',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  return accessToken;
};

const loginUser = async (payload: TLogin) => {
  const { email, password } = payload;

  // check if the user is exist
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user is not found!');
  }

  // check if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are blocked by the authority! Please contact them to know the issue!',
    );
  }

  // check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are unauthorized to login! Please contact to the authority.',
    );
  }

  // check if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    password,
    user?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials!');
  }

  const jwtPayload = {
    id: user?._id,
    email: user?.email,
    role: 'user',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as string,
  );

  return accessToken;
};

const changePasswordOfAdmin = async (
  adminData: JwtPayload,
  payload: TChangePassword,
) => {
  const { oldPassword, newPassword } = payload;

  // check if the user is exist
  const admin = await Admin.findOne({
    _id: adminData.id,
    email: adminData.email,
  }).select('+password');
  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'The admin is not found!');
  }

  // check if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    oldPassword,
    admin?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await Admin.findOneAndUpdate(
    {
      id: adminData.id,
      email: adminData.email,
    },
    {
      password: hashedPassword,
    },
  );

  return result;
};

const changePasswordOfUser = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const { oldPassword, newPassword } = payload;

  // check if the user is exist
  const user = await User.findOne({
    _id: userData.id,
    email: userData.email,
  }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user is not found!');
  }

  // check if the user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are blocked by the authority! Please contact them to know the issue!',
    );
  }

  // check if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    oldPassword,
    user?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round),
  );

  const result = await User.findByIdAndUpdate(userData.id, {
    password: hashedPassword,
  });

  return result;
};

// this function is used to get the user details from the toke. It is used in the /me route.
const getMe = async (userData: JwtPayload) => {
  const { id, email } = userData;

  const result = await User.findOne({ _id: id, email }).populate(
    'cart.product',
  );
  // if user not found
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

export const AuthServices = {
  loginAdmin,
  loginUser,
  changePasswordOfAdmin,
  changePasswordOfUser,
  getMe,
};
