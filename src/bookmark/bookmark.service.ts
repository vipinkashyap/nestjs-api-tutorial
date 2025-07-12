import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  /// GET => All Bookmarks

  getBookmarks(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  // GET => Bookmark by ID

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  /// POST => Create Bookmark

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prismaService.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  /// PUT => Edit Bookmark by ID

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    return this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
        userId,
      },
      data: dto,
    });
  }

  /// DELETE => Bookmark by ID

  deleteBookmarkById(userId: number, bookmarkId: number) {
    return this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }
}
