import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompanyAccess } from '../database/entities/user-company-access.entity';

@Injectable()
export class UserCompanyAccessService {
  constructor(
    @InjectRepository(UserCompanyAccess)
    private userCompanyAccessRepository: Repository<UserCompanyAccess>,
  ) {}

  async findActiveAccess(userId: string, companyId: string): Promise<UserCompanyAccess | null> {
    return this.userCompanyAccessRepository.findOne({
      where: {
        userId,
        companyId,
        isActive: true,
      },
      relations: ['role'],
    });
  }

  async getUserCompanies(userId: string): Promise<UserCompanyAccess[]> {
    return this.userCompanyAccessRepository.find({
      where: {
        userId,
        isActive: true,
      },
      relations: ['company', 'role'],
    });
  }
}
