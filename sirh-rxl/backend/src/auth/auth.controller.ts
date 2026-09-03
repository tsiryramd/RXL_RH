import { Controller, Post, Get, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CompanyAccessGuard } from '../common/guards/company-access.guard';

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(CompanyAccessGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.sub);
  }
}
