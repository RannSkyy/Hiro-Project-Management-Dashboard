import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ColumnId, Priority, Task } from '../../types';
import { filterAndSortTasks, COLUMN_CONFIG, COLUMNS, formatDueDate } from '../../utils/taskLogic';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  Edit2,
  ArrowUpDown,
} from 'lucide-react';

export const ListView: React.FC = () => {
  const {
    tasks,
    activeProjectId,
    filters,
    currentUser,
    members,
    moveTask,
    updateTask,
    deleteTask,
    openEditTaskModal,
    openCreateTaskModal,
    createTask,
    activeProject,
  } = useApp();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickColumn, setQuickColumn] = useState<ColumnId>('TODO');

  const filteredTasks = filterAndSortTasks(
    tasks,
    filters,
    currentUser.id,
    activeProjectId
  );

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !activeProjectId) return;

    createTask({
      projectId: activeProjectId,
      title: quickTitle.trim(),
      description: '',
      status: quickColumn,
      priority: 'MEDIUM',
      category: 'General',
      categoryColor: '#3B82F6',
      assigneeIds: [currentUser.id],
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: [],
      attachments: [],
      comments: [],
    });

    setQuickTitle('');
  };

  const priorityStyles: Record<Priority, string> = {
    URGENT: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    HIGH: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    MEDIUM: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    LOW: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F1F3F8] dark:bg-slate-950/60 min-h-[calc(100vh-140px)]">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Quick Inline Add Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center gap-3"
        >
          <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Plus className="w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Quick add new task title..."
              className="w-full text-xs bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={quickColumn}
            onChange={(e) => setQuickColumn(e.target.value as ColumnId)}
            className="text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            aria-label="Select status for new task"
          >
            {COLUMNS.map((col) => (
              <option key={col} value={col}>
                {COLUMN_CONFIG[col].label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
          >
            Add Task
          </button>
        </form>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-8">#</th>
                <th className="py-3 px-4">Task Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assignees</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No tasks found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, idx) => {
                  const assignees = members.filter((m) => task.assigneeIds.includes(m.id));
                  const isCompleted = task.status === 'COMPLETED';
                  const dueInfo = formatDueDate(task.dueDate, isCompleted);

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => openEditTaskModal(task.id)}
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => moveTask(task.id, e.target.value as ColumnId)}
                          className="text-[11px] font-bold py-1 px-2.5 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-1 focus:ring-blue-500"
                          style={{
                            borderLeft: `3px solid ${COLUMN_CONFIG[task.status].color}`,
                          }}
                        >
                          {COLUMNS.map((col) => (
                            <option key={col} value={col}>
                              {COLUMN_CONFIG[col].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: `${task.categoryColor}15`,
                            color: task.categoryColor,
                          }}
                        >
                          {task.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center -space-x-1.5">
                          {assignees.map((a) => (
                            <img
                              key={a.id}
                              src={a.avatar}
                              alt={a.name}
                              title={a.name}
                              className="w-6 h-6 rounded-full border border-white dark:border-slate-800 object-cover"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`flex items-center gap-1 text-[11px] ${
                            dueInfo.isOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{dueInfo.text}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditTaskModal(task.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${task.title}"?`)) {
                                deleteTask(task.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
