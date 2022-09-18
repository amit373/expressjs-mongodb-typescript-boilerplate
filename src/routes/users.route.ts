import { Router } from 'express';
import { UsersController } from '@app/controllers';
import { CreateUserDto } from '@app/dtos';
import { Routes } from '@app/interfaces';
import { validationMiddleware } from '@app/middlewares';
import { config } from '@app/config';

class Route implements Routes {
  public path = `${config.BASE_URL}/users`;
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
  }
}

export const UsersRoute = new Route();
