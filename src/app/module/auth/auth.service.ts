import { notFound } from "./../../middleware/notFound";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import type {
  ILoginUserPayload,
  IRegisterPatientPayload,
  IRequestUser,
  IUpdateUserProfile,
} from "./auth.interface";
import {  UserStatus } from "../../../../prisma/generated/prisma/enums";
import AppError from "../../errors/AppError";


const registerUser = async (payload: IRegisterPatientPayload) => {
  const { name, email, password, role } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User with this email already exists",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    if (newUser.role === "TECHNICIAN") {
      await tx.technicaianProfile.create({
        data: {
          userId: newUser.id,
          hourlyRate: 0,
        },
      });
    }

    return newUser;
  });

  const { password: _, ...userWithOutPassword } = result;
  return userWithOutPassword;
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tecnicianProfile: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }
  if (user.status === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support.",
    );
  }
  if (user.isDelete) {
    throw new AppError(httpStatus.FORBIDDEN, "This account has been deleted.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      tecnicianProfile: true,
    },
    omit: {
      password: true,
    },
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return isUserExists;
};

const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      config.node_env === "development"
        ? verifiedRefreshToken.error
        : "Invalid refresh token",
    );
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.isDelete || user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User is inactive or not found",
    );
  }

  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};
const updateMyProfile = async (
  userId: string,
  payload: IUpdateUserProfile
) => {
  const { name, profileImage } = payload;
  console.log(profileImage);
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      profileImage,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      status: true,
      updatedAt: true,
    },
  });

  return result;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  updateMyProfile
};
