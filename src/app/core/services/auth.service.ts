import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { User } from '../models';
import { ApiService } from './api.service';
import { AuthTokenService } from './auth-token.service';

@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);

  get currentUser(): User {
    return this.currentUserSubject.value;
  }

  get currentUser$(): Observable<User> {
    return this.currentUserSubject.pipe(distinctUntilChanged());
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  constructor(
    private apiService: ApiService,
    private authTokenService: AuthTokenService,
  ) { }

  // Verify token in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If token detected, attempt to get & store user's info
    if (this.authTokenService.getToken()) {
      this.apiService.getUser()
        .subscribe(
          user => this.setAuth(user),
          err => this.purgeAuth()
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  // Called in login component
  attemptAuth(username: string, password: string): Observable<User> {
    return this.apiService.login(username, password)
      .pipe(map(
        (user) => {
          this.setAuth(user);
          return user;
        }
      ));
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.authTokenService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  private setAuth(user: User) {
    // Save token sent from server in localstorage
    this.authTokenService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

}
