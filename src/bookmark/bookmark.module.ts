import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BookmarkService, PrismaService],
  exports: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
