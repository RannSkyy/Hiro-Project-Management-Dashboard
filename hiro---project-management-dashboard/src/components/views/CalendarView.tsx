import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { COLUMN_CONFIG } from '../../utils/taskLogic';
import { Task } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    tasks,
    activeProjectId,
    openEditTaskModal,
    openCreateTaskModal,
    createTask,
    currentUser,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  // Group tasks by Date string YYYY-MM-DD
  const tasksByDate: Record<string, Task[]> = {};
  projectTasks.forEach((task) => {
    if (task.dueDate) {
      if (!tasksByDate[task.dueDate]) {
        tasksByDate[task.dueDate] = [];
      }
      tasksByDate[task.dueDate].push(task);
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarCells.push({
      day,
      isCurrentMonth: false,
      dateStr: '',
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    calendarCells.push({
      day,
      isCurrentMonth: true,
      dateStr,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days to complete full grid (multiple of 7)
  const remainingCells = 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarCells.push({
      day,
      isCurrentMonth: false,
      dateStr: '',
    });
  }

  const handleDayClick = (dateStr: string) => {
    if (!dateStr) return;
    const title = prompt(`Create task for ${dateStr}:`);
    if (!title || !title.trim()) return;

    createTask({
      projectId: activeProjectId,
      title: title.trim(),
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'General',
      categoryColor: '#3B82F6',
      assigneeIds: [currentUser.id],
      dueDate: dateStr,
      subtasks: [],
      attachments: [],
      comments: [],
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F1F3F8] dark:bg-slate-950/60 min-h-[calc(100vh-140px)]">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Calendar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <p className="text-xs text-slate-400">Deadlines and task schedules</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-[11px] font-bold text-slate-400 uppercase py-2.5">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {calendarCells.map((cell, index) => {
            const dayTasks = cell.dateStr ? tasksByDate[cell.dateStr] || [] : [];

            return (
              <div
                key={index}
                onClick={() => cell.isCurrentMonth && cell.dateStr && handleDayClick(cell.dateStr)}
                className={`min-h-[110px] p-2 transition-colors flex flex-col group ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-600 pointer-events-none'
                    : 'hover:bg-blue-50/30 dark:hover:bg-blue-950/20 cursor-pointer'
                }`}
              >
                {/* Day number & Quick Add */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      cell.isToday
                        ? 'bg-blue-600 text-white'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cell.dateStr && handleDayClick(cell.dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity"
                      title="Add task on this day"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Day Task Chips */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-none">
                  {dayTasks.map((t) => {
                    const isCompleted = t.status === 'COMPLETED';
                    const config = COLUMN_CONFIG[t.status];

                    return (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTaskModal(t.id);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md truncate flex items-center gap-1 border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 line-through opacity-80'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-2xs'
                        }`}
                        title={`${t.title} (${config.label})`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
