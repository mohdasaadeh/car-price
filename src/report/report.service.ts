import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Report } from './report.entity';
import { User } from '../user/user.entity';

export interface ReportProps {
  id?: number;
  price?: number;
  make?: string;
  model?: string;
  year?: number;
  lng?: number;
  lat?: number;
  mileage?: number;
  user?: User;
}

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportData: ReportProps, user: User) {
    const report = this.repo.create(reportData);

    report.user = user;

    return this.repo.save(report);
  }
}
