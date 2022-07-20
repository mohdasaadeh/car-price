import { Body, Controller, Param, Get, Post, UseGuards } from '@nestjs/common';

import { ReportService } from './report.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('reports')
@Serialize(ReportDto)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('new')
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Get(':id/approve')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string) {
    return this.reportService.approve(parseInt(id));
  }
}
