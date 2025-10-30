import { PaymentReport, PaymentStats } from "../../types/payment";

export class ReportExporter {
  /**
   * 将PaymentReport导出为CSV格式
   */
  static exportToCSV(report: PaymentReport): string {
    if (!report) {
      return '';
    }

    let csvContent = '';
    
    // 添加报告元数据
    csvContent += `Payment Report,${report.period}\n`;
    csvContent += `Start Date,${report.startDate ? new Date(report.startDate).toISOString().split('T')[0] : ''}\n`;
    csvContent += `End Date,${report.endDate ? new Date(report.endDate).toISOString().split('T')[0] : ''}\n\n`;
    
    // 添加统计摘要
    csvContent += 'Statistics Summary\n';
    csvContent += 'Metric,Value\n';
    
    if (report.stats) {
      const stats = report.stats as PaymentStats;
      csvContent += `Total Payments,${stats.totalPayments || 0}\n`;
      csvContent += `Successful Payments,${stats.successfulPayments || 0}\n`;
      csvContent += `Failed Payments,${stats.failedPayments || 0}\n`;
      csvContent += `Refunded Payments,${stats.refundedPayments || 0}\n`;
      
      // 计算金额统计
      // 安全处理Decimal类型转换
      const toNumber = (value: any): number => {
        if (value === null || value === undefined) return 0;
        // 检查是否为Decimal类型或有toString方法
        if (value.toString && typeof value.toString === 'function') {
          return parseFloat(value.toString()) || 0;
        }
        return Number(value) || 0;
      };
      
      const totalAmount = report.payments?.filter(p => p).reduce((sum, p) => sum + toNumber(p?.amount), 0) || 0;
      const successfulAmount = report.payments?.filter(p => p?.status === 'COMPLETED').reduce((sum, p) => sum + toNumber(p?.amount), 0) || 0;
      const refundedAmount = report.payments?.filter(p => p?.status === 'REFUNDED').reduce((sum, p) => sum + toNumber(p?.amount), 0) || 0;
      const netAmount = successfulAmount - refundedAmount;
      
      csvContent += `Total Amount,${totalAmount.toFixed(2)}\n`;
      csvContent += `Successful Amount,${successfulAmount.toFixed(2)}\n`;
      csvContent += `Refunded Amount,${refundedAmount.toFixed(2)}\n`;
      csvContent += `Net Amount,${netAmount.toFixed(2)}\n`;
    }
    
    // 添加详细支付记录
    csvContent += '\nDetailed Payment Records\n';
    csvContent += 'Payment ID,Order ID,Amount,Status,Payment Method,Created At,Updated At\n';
    
    if (report.payments && Array.isArray(report.payments)) {
      report.payments.forEach(payment => {
        if (payment) {
          csvContent += `${this.escapeCsvField(payment.id || '')},`;
          csvContent += `${this.escapeCsvField(payment.order?.id || '')},`;
          csvContent += `${(payment.amount || 0).toFixed(2)},`;
          csvContent += `${this.escapeCsvField(payment.status || '')},`;
          csvContent += `${this.escapeCsvField(payment.paymentMethod || '')},`;
          csvContent += `${payment.createdAt ? new Date(payment.createdAt).toISOString() : ''},`;
          csvContent += `${payment.updatedAt ? new Date(payment.updatedAt).toISOString() : ''}\n`;
        }
      });
    }
    
    return csvContent;
  }
  
  /**
   * 将PaymentReport导出为JSON格式
   */
  static exportToJSON(report: PaymentReport): string {
    return JSON.stringify(report, null, 2);
  }
  
  /**
   * 转义CSV字段中的特殊字符
   */
  private static escapeCsvField(field: string): string {
    if (field === undefined || field === null) {
      return '';
    }
    
    const str = String(field);
    
    // 如果字段包含逗号、引号或换行符，则需要用引号包围并转义内部引号
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      // 转义内部引号 (将 " 替换为 "")
      const escapedField = str.replace(/"/g, '""');
      return `"${escapedField}"`;
    }
    
    return str;
  }
  
  /**
   * 生成带有时间戳的文件名
   */
  static generateFileName(baseName: string, extension: string): string {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('.')[0];
    
    return `${baseName}_${timestamp}.${extension}`;
  }
}