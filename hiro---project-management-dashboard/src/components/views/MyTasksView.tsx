import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Folder,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { COLUMN_CONFIG, formatDueDate } from '../../utils/taskLogic';
import { ColumnId } from '../../types';

export const MyTasksView: React.FC = () => {
  const {
    tasks,
    projects,
    currentUser,
    moveTask,
    openEditTaskModal,
    openCreateTaskModal,
    createTask,
    activeProjectId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'in_work' | 'completed'>('all');

  const myTasks = tasks.filter((t) => t.assigneeIds.includes(currentUser.id));

  const filteredTasks = myTasks.filter((t) => {
    if (activeTab === 'todo') return t.status === 'TODO';
    if (activeTab === 'in_work') return t.status === 'IN_WORK';
    if (activeTab === 'completed') return t.status === 'COMPLETED';
    return true;
  });

  const completedCount = myTasks.filter((t) => t.status === 'COMPLETED').length;
  const inWorkCount = myTasks.filter((t) => t.status === 'IN_WORK').length;
  const todoCount = myTasks.filter((t) => t.status === 'TODO').length;

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F1F3F8] dark:bg-slate-950/60 min-h-[calc(100vh-140px)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                My Tasks Focus
              </h1>
              <p className="text-xs text-slate-400">
                Logged in as <b className="text-slate-700 dark:text-slate-200">{currentUser.name}</b> • {myTasks.length} assigned tasks
              </p>
            </div>
          </div>

          <button
            onClick={() => openCreateTaskModal('TODO')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Personal Task</span>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Tasks ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('in_work')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'in_work'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            In Work ({inWorkCount})
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'todo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">No tasks in this list</h3>
              <p className="text-xs text-slate-400 mt-1">Enjoy your free time or add a new task!</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const dueInfo = formatDueDate(task.dueDate);
              const isCompleted = task.status === 'COMPLETED';

              return (
                <div
                  key={task.id}
                  onClick={() => openEditTaskModal(task.id)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group transition-all ${
                    isCompleted ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task.id, isCompleted ? 'TODO' : 'COMPLETED');
                      }}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                      }`}
                      aria-label="Toggle completed"
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <h3
                        className={`text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                        {project && (
                          <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            {project.name}
                          </span>
                        )}
                        <span>•</span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold"
                          style={{
                            backgroundColor: `${task.categoryColor}15`,
                            color: task.categoryColor,
                          }}
                        >
                          {task.category}
                        </span>
                        <span>•</span>
                        <span
                          className={`flex items-center gap-1 text-[11px] font-medium ${
                            dueInfo.isOverdue ? 'text-rose-600 font-bold' : ''
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {dueInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => moveTask(task.id, e.target.value as ColumnId)}
                      className="text-xs font-bold py-1 px-2.5 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      {['TODO', 'IN_WORK', 'QA', 'COMPLETED'].map((st) => (
                        <option key={st} value={st}>
                          {COLUMN_CONFIG[st as ColumnId].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
