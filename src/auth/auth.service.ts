import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService, // Assuming you have a ConfigService to manage environment variables
  ) {}

  async signup(dto: AuthDto) {
    try {
      // Lot of props here
      console.log({
        email: dto.email,
        password: dto.password,
      });

      // Generate password hash
      const passwordHash = await argon.hash(dto.password);
      console.log('Hash:', passwordHash);
      // Save user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
      });

      // Exclude 'hash' from the returned user object
      const { hash: _, ...userWithoutHash } = user;
      console.log('User created:', userWithoutHash);

      return userWithoutHash;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        console.error('Prisma error signing up:', error);
        if (error.code === 'P2002') {
          // Unique constraint failed
          throw new ForbiddenException('Email already exists');
        }
      }
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // If user does not exist
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // Compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // If password does not match
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    const payload = {
      sub: userId,
      email: email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: jwtSecret,
    });

    return {
      access_token: token,
    };
  }
}
