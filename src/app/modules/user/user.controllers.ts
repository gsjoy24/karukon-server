import { RequestHandler } from 'express';
import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully!',
    data: result,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students Updated successfully!',
    data: result,
  });
});

const addProductToCart: RequestHandler = catchAsync(async (req, res) => {
  const id = req?.userData?.id;

  const result = await UserServices.addProductToCart(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added to cart successfully!',
    data: result,
  });
});

const removeProductFromCart: RequestHandler = catchAsync(async (req, res) => {
  const id = req?.userData?.id;
  const { productId } = req.params;

  const result = await UserServices.removeProductFromCart(id, productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product removed from cart successfully!',
    data: result,
  });
});

const manipulateQuantityInCart: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req?.userData?.id;
    const { productId, quantity } = req.params;

    const result = await UserServices.manipulateQuantityInCart(
      userId,
      productId,
      Number(quantity),
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Quantity manipulated successfully!',
      data: result,
    });
  },
);

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  addProductToCart,
  removeProductFromCart,
  manipulateQuantityInCart,
};
