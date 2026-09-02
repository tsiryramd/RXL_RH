import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserCompanyAccessService } from '../user-company-access/user-company-access.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userCompanyAccessService: UserCompanyAccessService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // Attacher l'utilisateur à la requête
      request['user'] = payload;
      
      // Récupérer le companyId du header ou de la route
      const companyId = request.headers['x-company-id'] as string || request.params.companyId;
      
      // Pour les routes qui nécessitent un contexte société explicite
      if (companyId && companyId !== 'all') {
        // Vérifier en temps réel que l'utilisateur a accès à cette société
        const access = await this.userCompanyAccessService.findActiveAccess(payload.sub, companyId);
        
        if (!access) {
          throw new ForbiddenException(`Access denied to company ${companyId}`);
        }
        
        // Attacher le contexte société validé à la requête
        request['activeCompanyId'] = companyId;
        request['userRole'] = access.role;
      }
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or access revoked');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
