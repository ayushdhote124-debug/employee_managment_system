import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit-table';
import exceljs from 'exceljs';

const getReportQuery = (req) => {
  const { role, _id } = req.user;
  const { startDate, endDate, status } = req.query;

  let query = {};
  
  if (role === 'employee') {
    query.employee = _id;
  }

  if (startDate || endDate) {
    query.attendanceDate = {};
    if (startDate) query.attendanceDate.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.attendanceDate.$lte = end;
    }
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  return query;
};

/**
 * @desc    Get attendance data for reports
 * @route   GET /api/reports/attendance
 * @access  Private (Employee fetches own, Admin/Manager fetches all)
 */
export const getAttendanceReport = async (req, res) => {
  try {
    const query = getReportQuery(req);
    
    // For simplicity, we just fetch the last 100 records for the report
    const reportsData = await Attendance.find(query)
      .populate('employee', 'name email role')
      .sort({ attendanceDate: -1 })
      .limit(100);
      
    res.status(200).json({ reportsData });
  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
};

/**
 * @desc    Download PDF Report
 * @route   GET /api/reports/attendance/download/pdf
 * @access  Private
 */
export const downloadAttendanceReportPDF = async (req, res) => {
  try {
    const query = getReportQuery(req);
    const reportsData = await Attendance.find(query)
      .populate('employee', 'name email role')
      .sort({ attendanceDate: -1 });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${Date.now()}.pdf`);
    
    doc.pipe(res);
    doc.fontSize(18).text('Attendance Report', { align: 'center' });
    doc.moveDown();

    const tableArray = {
      headers: ['Date', 'Employee', 'Punch In', 'Punch Out', 'Hours', 'Status'],
      rows: reportsData.map(record => [
        new Date(record.attendanceDate).toLocaleDateString(),
        record.employee?.name || 'Unknown',
        record.punchIn ? new Date(record.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        record.punchOut ? new Date(record.punchOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        (record.workingHours || 0).toString(),
        record.status
      ])
    };

    await doc.table(tableArray, { 
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(10)
    });

    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Server error while generating PDF' });
  }
};

/**
 * @desc    Download Excel Report
 * @route   GET /api/reports/attendance/download/excel
 * @access  Private
 */
export const downloadAttendanceReportExcel = async (req, res) => {
  try {
    const query = getReportQuery(req);
    const reportsData = await Attendance.find(query)
      .populate('employee', 'name email role')
      .sort({ attendanceDate: -1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Employee', key: 'employee', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Punch In', key: 'punchIn', width: 15 },
      { header: 'Punch Out', key: 'punchOut', width: 15 },
      { header: 'Working Hours', key: 'hours', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    reportsData.forEach(record => {
      worksheet.addRow({
        date: new Date(record.attendanceDate).toLocaleDateString(),
        employee: record.employee?.name || 'Unknown',
        role: record.employee?.role || 'Unknown',
        punchIn: record.punchIn ? new Date(record.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        punchOut: record.punchOut ? new Date(record.punchOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
        hours: record.workingHours || 0,
        status: record.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel Generation Error:', error);
    res.status(500).json({ message: 'Server error while generating Excel' });
  }
};