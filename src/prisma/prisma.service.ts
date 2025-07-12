import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL') || 'file:./dev.db',
        },
      },
    });

    /// Print configuration for debugging
    console.log('PrismaService initialized with config:', {
      databaseUrl: configService.get('DATABASE_URL'),
    });
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.bookmark.deleteMany(),
    ]);
  }
}
