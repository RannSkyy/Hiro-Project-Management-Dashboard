import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users,
  Target,
  Plus,
} from 'lucide-react';
import { calculateProjectStats } from '../../utils/taskLogic';

export const HomeView: React.FC = () => {
  const {
    tasks,
    projects,
    members,
    currentUser,
    activities,
    setActiveProjectId,
    setActiveNav,
    openCreateTaskModal,
    openEditTaskModal,
  } = useApp();

  const totalStats = calculateProjectStats(tasks);
  const myTasks = tasks.filter((t) => t.assigneeIds.includes(currentUser.id));
  const myOpenTasks = myTasks.filter((t) => t.status !== 'COMPLETED');

  // Urgent tasks across all workspaces
  const urgentTasks = tasks
    .filter((t) => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'COMPLETED')
    .slice(0, 5);

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F1F3F8] dark:bg-slate-950/60 min-h-[calc(100vh-140px)] space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome back, {currentUser.name}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Hiro Workspace Dashboard
            </h1>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              You have {myOpenTasks.length} pending tasks assigned to you today. Team velocity is up
              18% this sprint with {totalStats.completed} tasks completed.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openCreateTaskModal('TODO')}
                className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
              <button
                onClick={() => setActiveNav('my-tasks')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>View My Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Background decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-40 -top-10 w-48 h-48 rounded-full bg-purple-400/20 blur-xl pointer-events-none" />
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Tasks</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {totalStats.total}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {totalStats.completionRate}% completion rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">In Progress</p>
              <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {totalStats.inWork}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Currently active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Completed</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalStats.completed}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Shipped on schedule</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Active Workspaces</p>
              <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {projects.length}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{members.length} team members</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Two Column Layout: Projects Progress & Urgent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Progress Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Active Workspaces Progress
                </h3>
                <p className="text-xs text-slate-400">Status and deliverables across projects</p>
              </div>
              <button
                onClick={() => setActiveNav('projects')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>All Boards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {projects.map((proj) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const stats = calculateProjectStats(projTasks);

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setActiveNav('projects');
                    }}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {proj.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          {proj.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {stats.completionRate}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stats.completionRate}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{projTasks.length} total tasks</span>
                      <span>
                        {stats.completed} completed • {stats.inWork} in work • {stats.qa} qa
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent & High Priority Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  High Priority
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                {urgentTasks.length} tasks
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-80 scrollbar-thin">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No urgent tasks at the moment. All clear!
                </div>
              ) : (
                urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => openEditTaskModal(task.id)}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer bg-slate-50/40 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {task.dueDate || 'No date'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-blue-600">
                      {task.title}
                    </h4>
                  </div>
                ))
              )}
            </div>

            {/* Recent Activity summary */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recent Team Activity
              </h4>
              <div className="space-y-2">
                {activities.slice(0, 3).map((a) => (
                  <div key={a.id} className="text-xs text-slate-600 dark:text-slate-300 truncate">
                    <span className="font-semibold text-slate-900 dark:text-white">{a.userName}</span>{' '}
                    {a.action} <span className="text-blue-600 dark:text-blue-400 font-medium">{a.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
