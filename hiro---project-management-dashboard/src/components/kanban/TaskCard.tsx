import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Heart,
  CheckSquare,
  Clock,
  MoreHorizontal,
  GripVertical,
} from 'lucide-react';
import { formatDueDate } from '../../utils/taskLogic';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay = false }) => {
  const { members, toggleTaskLike, openEditTaskModal } = useApp();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignees = members.filter((m) => task.assigneeIds.includes(m.id));
  const isCompleted = task.status === 'COMPLETED';
  const dueInfo = formatDueDate(task.dueDate, isCompleted);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'LOW':
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl p-4 border transition-all duration-200 select-none ${
        isDragging
          ? 'opacity-40 border-blue-500 scale-[0.98] shadow-lg'
          : isOverlay
          ? 'shadow-2xl border-blue-500 ring-2 ring-blue-500/20 rotate-2 cursor-grabbing'
          : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs hover:shadow-md cursor-pointer'
      }`}
      onClick={(e) => {
        // Prevent opening if user clicked like button
        if ((e.target as HTMLElement).closest('[data-prevent-open]')) return;
        openEditTaskModal(task.id);
      }}
    >
      {/* Top Header: Category Tag & Priority / Drag Grip */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${task.categoryColor}15`,
              borderColor: `${task.categoryColor}30`,
              color: task.categoryColor,
            }}
          >
            {task.category}
          </span>

          <span
            className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md border ${getPriorityStyle(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing p-0.5 rounded-md transition-colors"
          title="Drag card"
          aria-label="Drag task"
          data-prevent-open="true"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Cover / Attachment Thumbnail */}
      {task.coverImage && (
        <div className="mb-3 rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60">
          <img
            src={task.coverImage}
            alt={task.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Task Title */}
      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {task.title}
      </h3>

      {/* Task Description snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Checklist / Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              Subtasks
            </span>
            <span className="font-semibold font-mono">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                completedSubtasks === totalSubtasks ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info: Due Date, Assignees, Comments, Attachments, Likes */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-xs">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1 text-[11px]">
          <Clock className={`w-3 h-3 ${dueInfo.isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
          <span
            className={`font-medium ${
              dueInfo.isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : dueInfo.isToday
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {dueInfo.text}
          </span>
        </div>

        {/* Right stats and Assignees */}
        <div className="flex items-center gap-2.5">
          {/* Attachments count */}
          {task.attachments.length > 0 && (
            <span
              className="flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              title={`${task.attachments.length} attachments`}
            >
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments.length}</span>
            </span>
          )}

          {/* Comments count */}
          {task.comments.length > 0 && (
            <span
              className="flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              title={`${task.comments.length} comments`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </span>
          )}

          {/* Likes toggle */}
          <button
            data-prevent-open="true"
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskLike(task.id);
            }}
            className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md transition-colors ${
              task.isLiked
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                : 'text-slate-400 hover:text-rose-500 dark:hover:text-rose-400'
            }`}
            title="Like task"
            aria-label="Like task"
          >
            <Heart className={`w-3 h-3 ${task.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{task.likes}</span>
          </button>

          {/* Assignee Avatar Stack */}
          <div className="flex items-center -space-x-1.5 ml-1">
            {assignees.map((assignee) => (
              <img
                key={assignee.id}
                src={assignee.avatar}
                alt={assignee.name}
                title={`${assignee.name} (${assignee.role})`}
                className="w-5 h-5 rounded-full border border-white dark:border-slate-800 object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
