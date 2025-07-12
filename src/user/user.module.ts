import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PrismaService],
})
export class UserModule {}
