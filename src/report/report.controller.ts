import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ReportService } from './report.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('new')
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }
}
