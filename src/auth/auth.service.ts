import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  test() {}

  signup() {
    return { msg: 'I have signed up' };
  }

  signin() {
    return { msg: 'I have signed in' };
  }
}
