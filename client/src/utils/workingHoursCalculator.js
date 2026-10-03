/**
 * File Name: workingHoursCalculator.js
 * File Path: client/src/utils/workingHoursCalculator.js
 * 
 * Utility Description:
 * Helper functions to calculate precise elapsed working hours, break deductions,
 * formatted duration strings (e.g. "8h 30m"), decimal hours (e.g. 8.5), and overtime hours.
 * 
 * Functions & Exports:
 * - `calculateWorkingHours(inTime, outTime, breakMinutes = 0, standardHours = 8)`
 *   @param {string|Date} inTime - Check in timestamp
 *   @param {string|Date} outTime - Check out timestamp (defaults to current time if absent)
 *   @param {number} breakMinutes - Break duration to deduct in minutes
 *   @param {number} standardHours - Daily standard shift hours for overtime calculation
 *   @returns {object} { decimalHours, formattedHours, hours, minutes, overtimeHours, isOvertime }
 * 
 * - `formatDuration(totalMinutes)`
 *   @param {number} totalMinutes - Total duration in minutes
 *   @returns {string} Formatted string (e.g. "7h 45m")
 * 
 * Usage:
 * - PunchCard, PunchWidget, ReportsPage, AttendanceOverviewPage, ManagerApprovalsPage
 */

export function calculateWorkingHours(inTime, outTime, breakMinutes = 0, standardHours = 8) {
  if (!inTime) {
    return {
      decimalHours: 0,
      formattedHours: '0h 0m',
      hours: 0,
      minutes: 0,
      overtimeHours: 0,
      isOvertime: false
    };
  }

  const start = new Date(inTime);
  const end = outTime ? new Date(outTime) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      decimalHours: 0,
      formattedHours: '0h 0m',
      hours: 0,
      minutes: 0,
      overtimeHours: 0,
      isOvertime: false
    };
  }

  // Calculate gross difference in milliseconds
  let diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) diffMs = 0;

  // Convert to total net minutes deducting break
  let grossMinutes = Math.floor(diffMs / (1000 * 60));
  let netMinutes = Math.max(0, grossMinutes - (breakMinutes || 0));

  const hours = Math.floor(netMinutes / 60);
  const minutes = netMinutes % 60;
  const decimalHours = parseFloat((netMinutes / 60).toFixed(2));

  // Overtime calculation
  const overtimeMinutes = Math.max(0, netMinutes - standardHours * 60);
  const overtimeHours = parseFloat((overtimeMinutes / 60).toFixed(2));
  const isOvertime = overtimeHours > 0;

  return {
    decimalHours,
    formattedHours: `${hours}h ${minutes}m`,
    hours,
    minutes,
    overtimeHours,
    isOvertime
  };
}

export function formatDuration(totalMinutes = 0) {
  const mins = Math.max(0, Math.floor(totalMinutes));
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}