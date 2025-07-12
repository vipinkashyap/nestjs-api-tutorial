import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /// Post Request => Signup
  @Post('signup')
  signup() {
    this.authService.signup();
  }

  @Post('signin')
  signin() {
    this.authService.signin();
  }
}
