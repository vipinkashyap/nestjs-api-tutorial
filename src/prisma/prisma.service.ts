import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL') || 'file:./dev.db',
        },
      },
    });

    /// Print configuration for debugging
    console.log('PrismaService initialized with config:', {
      databaseUrl: this.configService.get('DATABASE_URL'),
    });
  }
}
