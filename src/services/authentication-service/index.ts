import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exclude } from "@/utils/prisma-utils";
import { User } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError } from "./errors";
import userService from "../users-service";
import { CreateUserParams } from "../users-service";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: exclude(user, "password"),
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
  const { REACT_APP_REDIRECT_URL, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } = process.env;
  const body = {
    code,
    grant_type: "authorization_code",
    redirect_uri: REACT_APP_REDIRECT_URL,
    client_id: REACT_APP_CLIENT_ID,
    client_secret: REACT_APP_CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const myArray = data.split("&");
  const accessToken = myArray[0];
  const access_token = accessToken.split("=");
  const accessTokenParsed = access_token[1];
  return accessTokenParsed;
}

async function fetchUser(token: string | string[]) {
  try {
    const response = await axios.get("http://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existUser = await userRepository.findByEmail(`${response.data.id}-github@drivent.com`);

    if (existUser) {
      const userToken = await createSession(existUser.id);

      const userData = {
        user: {
          id: existUser.id,
          email: existUser.email,
        },
        token: userToken,
      };

      return userData;
    }

    const createUserGitHub: CreateUserParams = {
      email: `${response.data.id}-github@drivent.com`,
      password: `${response.data.id}-${process.env.PASSWORD_TOKEN_GITHUB}`,
    };

    const user = await userService.createUser(createUserGitHub);

    const userToken = await createSession(user.id);
    const userData = {
      user: {
        id: user.id,
        email: user.email,
      },
      token: userToken,
    };
    return userData;
  } catch (error) {
    console.error(error.message);
  }
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn,
  exchangeCodeForAccessToken,
  fetchUser,
};

export default authenticationService;
export * from "./errors";
