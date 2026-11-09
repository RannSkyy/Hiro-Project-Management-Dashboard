import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnId, Task } from '../../types';
import { COLUMN_CONFIG } from '../../utils/taskLogic';
import { TaskCard } from './TaskCard';
import { useApp } from '../../context/AppContext';
import { Plus, MoreHorizontal } from 'lucide-react';

interface KanbanColumnProps {
  columnId: ColumnId;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ columnId, tasks }) => {
  const { openCreateTaskModal } = useApp();
  const config = COLUMN_CONFIG[columnId];

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      type: 'Column',
      columnId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl p-3 transition-colors duration-200 border min-w-[280px] max-w-xs sm:w-80 shrink-0 ${
        config.bgLight
      } ${
        isOver
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/70 dark:bg-blue-950/40'
          : config.border
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Status Color Pill */}
          <span
            className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
            style={{ backgroundColor: config.color }}
          />

          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {config.label}
          </h2>

          {/* Task Count Badge */}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono">
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => openCreateTaskModal(columnId)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
          title={`Add task to ${config.label}`}
          aria-label={`Add task to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List / Sortable Context */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 scrollbar-thin">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Empty State in Column */}
        {tasks.length === 0 && (
          <div
            onClick={() => openCreateTaskModal(columnId)}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group"
          >
            <Plus className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Drop task here</span>
            <span className="text-[10px] text-slate-400">or click to add</span>
          </div>
        )}
      </div>

      {/* Bottom Column Action */}
      <button
        onClick={() => openCreateTaskModal(columnId)}
        className="mt-3 py-2 px-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/80 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Task</span>
      </button>
    </div>
  );
};
