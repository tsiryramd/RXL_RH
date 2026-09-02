import { Module } from '@nestjs/common';
import { UserCompanyAccessService } from './user-company-access.service';
import { UserCompanyAccessController } from './user-company-access.controller';

@Module({
  providers: [UserCompanyAccessService],
  controllers: [UserCompanyAccessController]
})
export class UserCompanyAccessModule {}
