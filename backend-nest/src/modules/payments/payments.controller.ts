import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
  Query,
  Res,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PaymentsService } from "./payments.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Payment, $Enums } from "generated/prisma/client";
import { PaymentWithOrder, PaymentReport, PaymentMethodStats } from "../../types/payment";
import { RequestWithUser } from "../../types/user";
import { ReportExporter } from "../../common/utils/report-exporter";
import { Response } from "express";

@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/order/:orderId")
  async createPayment(
    @Param("orderId") orderId: string,
    @Body() data: { paymentMethod: $Enums.PaymentMethod },
    @Req() req: RequestWithUser
  ): Promise<Payment> {
    // 验证用户是否有权限支付该订单
    const order = await this.paymentsService.getOrderWithUser(orderId);
    if (order.userId !== req.user.id) {
      throw new ForbiddenException("Access denied");
    }
    const payment = await this.paymentsService.createPayment(orderId, data.paymentMethod);
    return payment;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<Payment[]> {
    // 管理员可以查看所有支付记录
    if (req.user.role === $Enums.Role.ADMIN) {
      return this.paymentsService.findAll();
    }
    throw new ForbiddenException("Access denied");
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async findById(@Param("id") id: string, @Req() req: RequestWithUser): Promise<Payment> {
    // const payment = await this.paymentsService.findById(id);
    const payment = await this.paymentsService.getPaymentWithOrder(id);
    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    // 只有管理员或订单所有者可以查看支付详情
    if (req.user.role !== $Enums.Role.ADMIN && payment.order?.userId !== req.user.id) {
      throw new ForbiddenException("Access denied");
    }
    return payment;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("order/:orderId")
  async findByOrderId(@Param("orderId") orderId: string, @Req() req: RequestWithUser): Promise<Payment[]> {
    const payments = await this.paymentsService.findByOrderId(orderId);
    // 验证权限
    if (payments.length > 0) {
      if (req.user.role !== $Enums.Role.ADMIN && payments[0]?.order?.userId !== req.user.id) {
        throw new ForbiddenException("Access denied");
      }
    }
    return payments;
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id/refund")
  async refundPayment(
    @Param("id") id: string,
    @Body() data: { reason: string },
    @Req() req: RequestWithUser
  ): Promise<Payment> {
    // 只有管理员可以退款
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }
    return this.paymentsService.refundPayment(id, data.reason);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/summary")
  async getPaymentStats(@Req() req: RequestWithUser) {
    // 只有管理员可以查看统计信息
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }
    return this.paymentsService.getPaymentStats();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports/period/:period")
  async getPaymentReportByPeriod(@Param("period") period: string, @Req() req: RequestWithUser): Promise<PaymentReport> {
    // 只有管理员可以查看报告
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    return this.paymentsService.getPaymentReportByPeriod(period);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports/custom")
  async getCustomPaymentReport(
    @Query("period") period: string,
    @Query("startDate") startDateStr: string,
    @Query("endDate") endDateStr: string,
    @Req() req: RequestWithUser
  ): Promise<PaymentReport> {
    // 只有管理员可以查看报告
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    // 验证日期格式
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException("Invalid date format");
    }

    return this.paymentsService.generatePaymentReport(period, startDate, endDate);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("stats/methods")
  async getPaymentMethodStats(@Req() req: RequestWithUser): Promise<PaymentMethodStats[]> {
    // 只有管理员可以查看支付方式统计
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    return this.paymentsService.getPaymentMethodStats();
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports/export/:period/csv")
  async exportPaymentReportAsCSV(
    @Param("period") period: string,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ): Promise<void> {
    // 只有管理员可以导出报告
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    try {
      // 获取报告数据
      const report = await this.paymentsService.getPaymentReportByPeriod(period);

      // 导出为CSV
      const csvContent = ReportExporter.exportToCSV(report);
      const fileName = ReportExporter.generateFileName(`payment_report_${period}`, "csv");

      // 设置响应头
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      // 发送CSV内容
      res.send(csvContent);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports/export/:period/json")
  async exportPaymentReportAsJSON(
    @Param("period") period: string,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ): Promise<void> {
    // 只有管理员可以导出报告
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    try {
      // 获取报告数据
      const report = await this.paymentsService.getPaymentReportByPeriod(period);

      // 导出为JSON
      const jsonContent = ReportExporter.exportToJSON(report);
      const fileName = ReportExporter.generateFileName(`payment_report_${period}`, "json");

      // 设置响应头
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      // 发送JSON内容
      res.send(jsonContent);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("reports/export/custom/csv")
  async exportCustomPaymentReportAsCSV(
    @Query("period") period: string,
    @Query("startDate") startDateStr: string,
    @Query("endDate") endDateStr: string,
    @Req() req: RequestWithUser,
    @Res() res: Response
  ): Promise<void> {
    // 只有管理员可以导出报告
    if (req.user.role !== $Enums.Role.ADMIN) {
      throw new ForbiddenException("Access denied");
    }

    try {
      // 验证日期格式
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).send({ error: "Invalid date format" });
        return;
      }

      // 获取报告数据
      const report = await this.paymentsService.generatePaymentReport(period, startDate, endDate);

      // 导出为CSV
      const csvContent = ReportExporter.exportToCSV(report);
      const fileName = ReportExporter.generateFileName("custom_payment_report", "csv");

      // 设置响应头
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      // 发送CSV内容
      res.send(csvContent);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  // 微服务消息处理器
  @MessagePattern("payments.create")
  async createPaymentMicroservice(@Payload() data: { orderId: string; paymentMethod: $Enums.PaymentMethod }) {
    try {
      const payment = await this.paymentsService.createPayment(data.orderId, data.paymentMethod);
      return { success: true, payment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("payments.find_by_order_id")
  async findPaymentsByOrderId(@Payload() data: { orderId: string }) {
    try {
      const payments = await this.paymentsService.findByOrderId(data.orderId);
      return { success: true, payments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("payments.refund")
  async refundPaymentMicroservice(@Payload() data: { paymentId: string; reason: string }) {
    try {
      const payment = await this.paymentsService.refundPayment(data.paymentId, data.reason);
      return { success: true, payment };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("payments.get_stats")
  async getPaymentStatsMicroservice() {
    try {
      const stats = await this.paymentsService.getPaymentStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("payments.get_report")
  async getPaymentReportMicroservice(@Payload() data: { period: string }) {
    try {
      const report = await this.paymentsService.getPaymentReportByPeriod(data.period);
      return { success: true, report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern("payments.get_method_stats")
  async getPaymentMethodStatsMicroservice() {
    try {
      const stats = await this.paymentsService.getPaymentMethodStats();
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
