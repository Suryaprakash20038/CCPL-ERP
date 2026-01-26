/**
 * CCPL Attendance Store
 * Handles persistence for attendance logs (headers) and entries (details)
 */

// Get all attendance logs (summaries of submissions)
export const getAttendanceLogs = () => {
    const data = localStorage.getItem('ccpl_attendance_logs');
    return data ? JSON.parse(data) : [];
};

// Get all attendance entries (detailed records for people)
export const getAttendanceEntries = () => {
    const data = localStorage.getItem('ccpl_attendance_entries');
    return data ? JSON.parse(data) : [];
};

// Save a new submission
export const saveAttendanceSubmission = (log, entries) => {
    const logs = getAttendanceLogs();
    const allEntries = getAttendanceEntries();

    // Check if a submission already exists for this project + date + engineer
    // To allow overwriting/updating same day submission
    const existingLogIndex = logs.findIndex(l =>
        l.date === log.date &&
        l.projectId === log.projectId &&
        l.siteEngineerId === log.siteEngineerId
    );

    if (existingLogIndex >= 0) {
        // Remove old entries for this specific attendanceId
        const oldAttendanceId = logs[existingLogIndex].attendanceId;
        const filteredEntries = allEntries.filter(e => e.attendanceId !== oldAttendanceId);

        // Update log
        logs[existingLogIndex] = log;

        // Update entries
        localStorage.setItem('ccpl_attendance_entries', JSON.stringify([...filteredEntries, ...entries]));
        localStorage.setItem('ccpl_attendance_logs', JSON.stringify(logs));
    } else {
        // New submission
        localStorage.setItem('ccpl_attendance_logs', JSON.stringify([log, ...logs]));
        localStorage.setItem('ccpl_attendance_entries', JSON.stringify([...entries, ...allEntries]));
    }
};

// Get entries for a specific log
export const getEntriesForLog = (attendanceId) => {
    const allEntries = getAttendanceEntries();
    return allEntries.filter(e => e.attendanceId === attendanceId);
};

// Delete a submission
export const deleteAttendanceLog = (attendanceId) => {
    const logs = getAttendanceLogs();
    const entries = getAttendanceEntries();

    const filteredLogs = logs.filter(l => l.attendanceId !== attendanceId);
    const filteredEntries = entries.filter(e => e.attendanceId !== attendanceId);

    localStorage.setItem('ccpl_attendance_logs', JSON.stringify(filteredLogs));
    localStorage.setItem('ccpl_attendance_entries', JSON.stringify(filteredEntries));
};

// Check if a date is read-only for a user
export const isReadOnlyDate = (dateString, userRole) => {
    if (userRole === 'superadmin' || userRole === 'admin') return false;

    const today = new Date().toISOString().split('T')[0];
    return dateString !== today;
};
