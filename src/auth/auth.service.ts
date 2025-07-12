import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
    return { msg: 'I have signed in' };
  }
}
