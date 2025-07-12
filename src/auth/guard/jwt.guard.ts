import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  //   async canActivate(context: ExecutionContext): Promise<boolean> {
  //     const request = context.switchToHttp().getRequest();
  //     const user = await this.jwtService.verifyAsync(
  //       request.headers.authorization,
  //     );
  //     request.user = user;
  //     return true;
  //   }
}

export { JwtGuard };
