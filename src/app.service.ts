import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { ReportType, data } from './data';
import { ReportResponseDto } from './dto/report.dto';

interface Report {
  amount: number;
  source: string;
}

interface updateReport {
  amount?: number;
  source?: string;
}

@Injectable()
export class AppService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto | undefined {
    const report = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!report) return;

    return new ReportResponseDto(report);
  }

  createReport(
    type: ReportType,
    { amount, source }: Report,
  ): ReportResponseDto {
    const newReport = {
      id: uuid(),
      amount,
      source,
      created_at: new Date(),
      updated_at: new Date(),
      type,
    };
    data.report.push(newReport);
    return new ReportResponseDto(newReport);
  }

  updateReport(
    type: ReportType,
    id: string,
    body: updateReport,
  ): ReportResponseDto {
    const reportToUpdate = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!reportToUpdate) {
      throw new NotFoundException('Report not found');
    }

    const reportIndex = data.report.findIndex(
      (report) => report.id === reportToUpdate.id,
    );

    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
      updated_at: new Date(),
    };

    return new ReportResponseDto(data.report[reportIndex]);
  }

  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => (report.id = id));

    if (reportIndex === -1) return;

    data.report.splice(reportIndex, 1);
    return 'data deleted';
  }
}
