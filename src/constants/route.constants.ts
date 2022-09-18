export const RoutesConstants = {
  AUTH: {
    DEFAULT: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    SIGNUP: '/signup',
    ME: '/me',
    FORGOT_PASSWORD: '/forgotPassword',
    RESET_PASSWORD: '/resetPassword/:resetToken',
  },
  USER: {
    DEFAULT: '/users',
    ALL: '/',
    DETAIL: '/:id',
  },
  HEALTH: '/health',
  NOT_FOUND: '*',
};
