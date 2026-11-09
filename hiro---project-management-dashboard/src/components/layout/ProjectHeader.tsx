import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Share2,
  Plus,
  UserCheck,
  Filter,
  CheckCircle2,
  Sparkles,
  Download,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { calculateProjectStats } from '../../utils/taskLogic';

export const ProjectHeader: React.FC = () => {
  const {
    activeProject,
    toggleProjectFavorite,
    members,
    filters,
    updateFilter,
    resetFilters,
    openCreateTaskModal,
    openShareModal,
    projectTasks,
    addMember,
    showToast,
  } = useApp();

  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  if (!activeProject) return null;

  const projectMembers = members.filter((m) => activeProject.memberIds.includes(m.id));
  const stats = calculateProjectStats(projectTasks);

  const categories = Array.from(new Set(projectTasks.map((t) => t.category).filter(Boolean)));
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  const hasActiveFilters =
    filters.onlyMy ||
    filters.category !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.assigneeId !== 'ALL' ||
    filters.searchQuery !== '';

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projectTasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeProject.name.toLowerCase().replace(/\s+/g, '_')}_tasks.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${projectTasks.length} tasks as JSON`, 'success');
  };

  const handleQuickAddMember = () => {
    const name = prompt('Enter new member name:');
    if (!name) return;
    const email = prompt('Enter email address:', `${name.toLowerCase().replace(/\s+/g, '.')}@hiro.design`);
    const role = prompt('Enter role:', 'Product Specialist') || 'Product Specialist';

    addMember({
      name,
      email: email || `${name.toLowerCase()}@hiro.design`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
      role,
      department: 'Product',
      status: 'active',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 sm:py-5 space-y-4">
      {/* Top Row: Title, Favorite, Stats, and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Project Title & Category */}
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm font-bold text-lg shrink-0"
            style={{ backgroundColor: activeProject.color }}
          >
            {activeProject.name.charAt(0)}
          </span>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {activeProject.name}
              </h1>

              {/* Favorite Button */}
              <button
                onClick={() => toggleProjectFavorite(activeProject.id)}
                className={`p-1.5 rounded-xl border transition-all ${
                  activeProject.isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={activeProject.isFavorite ? 'Starred project' : 'Star project'}
                aria-label="Toggle favorite"
              >
                <Star
                  className={`w-4 h-4 ${activeProject.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
                />
              </button>

              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {activeProject.category}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-xl">
              {activeProject.description}
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Member Avatars Stack */}
          <div className="flex items-center -space-x-2 mr-2">
            {projectMembers.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} • ${member.role}`}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-xs"
              />
            ))}
            <button
              onClick={handleQuickAddMember}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xs font-bold transition-colors shadow-xs"
              title="Add Member to Project"
              aria-label="Add project member"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* "Only My" Filter Button */}
          <button
            onClick={() => updateFilter({ onlyMy: !filters.onlyMy })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              filters.onlyMy
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            aria-label="Filter only my tasks"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Only My</span>
          </button>

          {/* Share Button */}
          <button
            onClick={openShareModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Share project"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Quick Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Quick actions"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Quick Action</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showQuickActions && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-40 animate-in fade-in"
                onClick={() => setShowQuickActions(false)}
              >
                <button
                  onClick={() => openCreateTaskModal('TODO')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Add New Task</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleQuickAddMember}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-600" />
                  <span>Invite Member</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: + New Task */}
          <button
            onClick={() => openCreateTaskModal('TODO')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Create new task"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Quick Status Bar and Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Progress & Quick Metrics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Progress:</span>
            <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.completionRate}%</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>
              <b>{stats.completed}</b> / {stats.total} completed
            </span>
            {stats.overdue > 0 && (
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                {stats.overdue} overdue
              </span>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => updateFilter({ category: e.target.value })}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 focus:ring-1 focus:ring-blue-500"
            aria-label="Filter by category"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => updateFilter({ priority: e.target.value })}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 focus:ring-1 focus:ring-blue-500"
            aria-label="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter({ sortBy: e.target.value as any })}
            className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 focus:ring-1 focus:ring-blue-500"
            aria-label="Sort tasks"
          >
            <option value="order">Custom Order</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
