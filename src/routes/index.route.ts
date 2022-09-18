import { Router } from 'express';
import { IndexController } from '@app/controllers';
import { Routes } from '@app/interfaces';
import { RoutesConstants } from '@app/constants';
import { config } from '@app/config';

class Route implements Routes {
  public path = `${config.BASE_URL}/`;
  public router = Router();
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.indexController.index);
    this.router.get(RoutesConstants.HEALTH, this.indexController.health);
  }
}
export const IndexRoute = new Route();
