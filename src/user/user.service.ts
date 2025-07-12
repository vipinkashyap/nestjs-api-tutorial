import { Injectable } from '@nestjs/common';
import { EditUserDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    return user;
  }
}
