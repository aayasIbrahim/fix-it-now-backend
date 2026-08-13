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
} from "./auth.interface";
import { Role } from "../../../../prisma/generated/prisma/enums";
import AppError from "../../errors/AppError";
import prismaConfig from "../../../../prisma.config";

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

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

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

    return newUser
  });
 
const {password:_,...userWithOutPassword}=result
return userWithOutPassword
};

// const loginUser = async (payload: ILoginUserPayload) => {
//   const { password } = payload;
//   const email = payload.email.trim().toLowerCase();

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   //   if (user.status === UserStatus.BLOCKED) {
//   //     throw new Error("User is blocked");
//   //   }

//   //   if (user.isDeleted || user.status === UserStatus.DELETED) {
//   //     throw new Error("User is deleted");
//   //   }

//   const isPasswordMatched = await bcrypt.compare(password, user.password);

//   if (!isPasswordMatched) {
//     throw new Error("Invalid credentials");
//   }

//   const jwtPayload = {
//     userId: user.id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   };

//   const accessToken = jwtUtils.createToken(
//     jwtPayload,
//     config.jwt_access_secret,
//     config.jwt_access_expires_in as SignOptions,
//   );

//   const refreshToken = jwtUtils.createToken(
//     jwtPayload,
//     config.jwt_refresh_secret,
//     config.jwt_refresh_expires_in as SignOptions,
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
// };

// const getMe = async (user: IRequestUser) => {
//   const isUserExists = await prisma.user.findUnique({
//     where: {
//       id: user.userId,
//     },
//     // include: {
//     //   patient: true,
//     // },
//     omit: {
//       password: true,
//     },
//   });

//   if (!isUserExists) {
//     throw new Error("User not found");
//   }

//   return isUserExists;
// };

// const refreshToken = async (token: string) => {
//   const verifiedRefreshToken = jwtUtils.verifyToken(
//     token,
//     config.jwt_refresh_secret,
//   );

//   if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
//     throw new Error(
//       config.node_env === "development"
//         ? verifiedRefreshToken.error
//         : "Invalid refresh token",
//     );
//   }

//   const data = verifiedRefreshToken.data as JwtPayload;

//   const user = await prisma.user.findUnique({
//     where: { id: data.userId },
//   });

//   //   if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
//   //     throw new Error("User is inactive or not found");
//   //   }

//   //   const jwtPayload = {
//   //     userId: user.id,
//   //     name: user.name,
//   //     email: user.email,
//   //     role: user.role,
//   //   };

//   const accessToken = jwtUtils.createToken(
//     jwtPayload,
//     config.jwt_access_secret,
//     config.jwt_access_expires_in as SignOptions,
//   );

//   const refreshToken = jwtUtils.createToken(
//     jwtPayload,
//     config.jwt_refresh_secret,
//     config.jwt_refresh_expires_in as SignOptions,
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
// };

export const AuthService = {
  registerUser,
//   loginUser,
//   getMe,
//   refreshToken,
};
