import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
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
    console.log({
      email: dto.email,
      password: dto.password,
      typeOfEmail: typeof dto.email,
      typeOfPassword: typeof dto.password,
    });
    this.authService.signup();
  }

  @Post('signin')
  signin() {
    this.authService.signin();
  }
}
