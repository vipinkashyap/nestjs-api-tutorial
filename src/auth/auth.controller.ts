import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /// Post Request => Signup
  /// Body: { email: string, password: string }
  /// Response: { message: string, userId: string }
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // Lot of props here
    console.log({ dto: dto });
    this.authService.signup();
  }

  @Post('signin')
  signin() {
    this.authService.signin();
  }
}
