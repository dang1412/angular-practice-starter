import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { User } from '../models';

const mockUser: User = {
  email: '',
  token: '',
  username: '',
  bio: '',
  image: '',
};

@Injectable()
export class ApiService {

  getUser(): Observable<User> {
    return observableOf(mockUser);
  }

  login(username: string, password: string): Observable<User> {
    return observableOf(mockUser);
  }

}
