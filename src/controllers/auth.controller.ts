import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@app/dtos';
import { RequestWithUser, IUser } from '@app/interfaces';
import { AuthService } from '@app/services';

class AuthController {
  public authService = new AuthService();

  /**
   * @swagger
   *
   * /auth/signup:
   *   post:
   *     tags:
   *      - Auth
   *     description: Signup to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: user data.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Signup'
   *     responses:
   *       200:
   *         description: success
   * definitions:
   *    Signup:
   *      required:
   *          - email
   *          - password
   *      properties:
   *        email:
   *          type: string
   *          description: User email
   *        password:
   *          type: string
   *          description: User password
   */
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: IUser = await this.authService.signup(userData);

      return res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   *
   * /auth/login:
   *   post:
   *     tags:
   *      - Auth
   *     description: Login to the application
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: user data.
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Signup'
   *     responses:
   *       200:
   *         description: success
   * definitions:
   *    Signup:
   *      required:
   *          - email
   *          - password
   *      properties:
   *        email:
   *          type: string
   *          description: User email
   *        password:
   *          type: string
   *          description: User password
   */
  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      return res.status(200).json({ data: findUser, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   *
   * /auth/logout:
   *   get:
   *     tags:
   *      - Auth
   *     description: Login to the application
   *     security:
   *       - [{ bearerAuth: [] }]
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: success
   */
  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      return res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
