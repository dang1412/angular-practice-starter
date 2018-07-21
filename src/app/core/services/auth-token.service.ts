const tokenStorageProperty = 'authToken';

export class AuthTokenService {

  getToken(): String {
    return window.localStorage[tokenStorageProperty];
  }

  saveToken(token: String) {
    window.localStorage[tokenStorageProperty] = token;
  }

  destroyToken() {
    window.localStorage.removeItem(tokenStorageProperty);
  }

}
