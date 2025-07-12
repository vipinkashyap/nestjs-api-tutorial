import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret', // Provide a fallback value
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('JWT payload validate:', payload);
    // Here you can add additional validation logic if needed
    // For example, you can check if the user exists in the database
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    return user;
    // return { userId: payload.sub, email: payload.email }; // Return the user object with userId and email
  }
}
