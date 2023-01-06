import authenticationService, { SignInParams } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function loginUsingGithub(req: Request, res: Response) {
  const code = req.body.code as string;
  try {
    const token = await authenticationService.exchangeCodeForAccessToken(code);
    const user = await authenticationService.fetchUser(token);
    return res.status(200).send(user);
  } catch (error) {
    console.log("err", error.response.data);
    res.sendStatus(500);
  }
}
