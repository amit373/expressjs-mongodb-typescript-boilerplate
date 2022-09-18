import express, { Request, Application } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import { join } from 'path';
import { Server } from 'http';

import { config } from '@app/config';
import { errorMiddleware } from '@app/middlewares';
import { connectToDatabase } from '@app/databases';
import { Routes } from '@app/interfaces';
import { loggerService } from '@app/libs';
import { ErrorMessage, RoutesConstants } from '@app/constants';
import { AuthRoute, IndexRoute, UsersRoute } from '@app/routes';
import { NotFoundException } from '@app/exceptions';
import { swaggerSpecs } from '@app/utils';

process.on('uncaughtException', (err: Error) => {
  console.log(ErrorMessage.UNCAUGHT_EXCEPTION);
  loggerService.logger.error(`UNCAUGHT EXCEPTION! ${err?.name}: ${err?.message}`, () => process.exit(1));
});

class App {
  public app: Application;
  public env: string;
  public port: number | boolean;
  public server: Server;
  constructor() {
    this.app = express();
    this.env = config.NODE_ENV;
    this.port = config.PORT;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public async bootstrap(): Promise<void> {
    try {
      await connectToDatabase().then(() => {
        loggerService.info(`Database connected 🔥 on ${this.env} mode...`, {
          controller: App.name,
          function: 'bootstrap',
        });
        this.listen();
      });
    } catch (error) {
      loggerService.error(`Database not connected: ${error?.message}`, {
        controller: App.name,
        function: 'bootstrap',
      });
      process.exit(1);
    }
  }

  private listen(): void {
    this.server = this.app.listen(this.port, () => {
      loggerService.info(`🚀 App listening on the port ${this.port} ENV: ${this.env} mode...`, {
        controller: App.name,
        function: 'listen',
      });
    });
  }

  public getServerInstance(): Application {
    return this.app;
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({ origin: config.CORS.ORIGIN, credentials: config.CORS.CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(mongoSanitize());
    this.app.use(xss());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(join(__dirname, 'public')));
    this.app.use(
      rateLimit({
        max: config.RATE_LIMIT.MAX,
        windowMs: config.RATE_LIMIT.WINDOW__MS,
        message: ErrorMessage.TO_MANY_REQUEST,
      }),
    );
  }

  private initializeRoutes(): void {
    const routes: Routes[] = [AuthRoute, IndexRoute, UsersRoute];
    routes?.forEach(route => this.app.use(route.path, route.router));
  }

  private initializeSwagger(): void {
    this.app.use(config.SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  }

  private initializeErrorHandling(): void {
    this.app.all(RoutesConstants.NOT_FOUND, (req: Request) => {
      throw new NotFoundException(`Can't find ${req?.originalUrl} on this server!`);
    });
    this.app.use(errorMiddleware);
  }
}

process.on('SIGTERM', () => {
  console.log(ErrorMessage.SIGTERM);
  new App().server?.close(() => {
    loggerService.logger.error('HTTP server closed!');
  });
});

process.on('unhandledRejection', (err: Error) => {
  console.log(ErrorMessage.UNCAUGHT_REJECTION);
  loggerService.logger.error(`UNCAUGHT REJECTION! ${err?.name}: ${err?.message}`, () => process.exit(1));
});

export default new App();
