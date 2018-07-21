import { ApiService } from './api.service';
import { AuthTokenService } from './auth-token.service';
import { AuthService } from './auth.service';

export const CoreServices = [
  ApiService,
  AuthTokenService,
  AuthService,
];

export {
  ApiService,
  AuthTokenService,
  AuthService,
};
