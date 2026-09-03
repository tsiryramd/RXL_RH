import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompanyAccessService } from './user-company-access.service';
import { UserCompanyAccessController } from './user-company-access.controller';
import { UserCompanyAccess } from '../database/entities/user-company-access.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCompanyAccess]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserCompanyAccessService],
  controllers: [UserCompanyAccessController],
  exports: [UserCompanyAccessService],
})
export class UserCompanyAccessModule {}
