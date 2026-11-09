import { Task, ColumnId, FilterState, Priority } from '../types';

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
};

export const COLUMN_CONFIG: Record<ColumnId, { label: string; color: string; bgLight: string; border: string }> = {
  TODO: {
    label: 'TODO',
    color: '#64748B', // slate
    bgLight: 'bg-slate-50 dark:bg-slate-900/40',
    border: 'border-slate-300 dark:border-slate-700',
  },
  IN_WORK: {
    label: 'IN WORK',
    color: '#2563EB', // blue
    bgLight: 'bg-blue-50/50 dark:bg-blue-950/20',
    border: 'border-blue-300 dark:border-blue-800',
  },
  QA: {
    label: 'QA',
    color: '#F59E0B', // amber/warning
    bgLight: 'bg-amber-50/50 dark:bg-amber-950/20',
    border: 'border-amber-300 dark:border-amber-800',
  },
  COMPLETED: {
    label: 'COMPLETED',
    color: '#10B981', // green/success
    bgLight: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    border: 'border-emerald-300 dark:border-emerald-800',
  },
};

export const COLUMNS: ColumnId[] = ['TODO', 'IN_WORK', 'QA', 'COMPLETED'];

/**
 * Filter and sort tasks based on current filter state and current user ID
 */
export function filterAndSortTasks(
  tasks: Task[],
  filters: FilterState,
  currentUserId: string,
  projectId?: string
): Task[] {
  return tasks
    .filter((task) => {
      // Project match
      if (projectId && task.projectId !== projectId) {
        return false;
      }

      // Search query (title, description, category)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // Only My filter
      if (filters.onlyMy && !task.assigneeIds.includes(currentUserId)) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'ALL' && task.category !== filters.category) {
        return false;
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'ALL' && task.priority !== filters.priority) {
        return false;
      }

      // Specific Assignee filter
      if (filters.assigneeId && filters.assigneeId !== 'ALL' && !task.assigneeIds.includes(filters.assigneeId)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case 'priority': {
          return (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        }
        case 'title': {
          return a.title.localeCompare(b.title);
        }
        case 'order':
        default: {
          return a.order - b.order;
        }
      }
    });
}

/**
 * Group filtered tasks by column id
 */
export function groupTasksByColumn(tasks: Task[]): Record<ColumnId, Task[]> {
  const groups: Record<ColumnId, Task[]> = {
    TODO: [],
    IN_WORK: [],
    QA: [],
    COMPLETED: [],
  };

  tasks.forEach((task) => {
    if (groups[task.status]) {
      groups[task.status].push(task);
    } else {
      groups.TODO.push(task);
    }
  });

  return groups;
}

/**
 * Move a task to a new status and reorder
 */
export function reorderOrMoveTask(
  tasks: Task[],
  activeTaskId: string,
  targetStatus: ColumnId,
  targetIndex?: number
): Task[] {
  const activeTask = tasks.find((t) => t.id === activeTaskId);
  if (!activeTask) return tasks;

  const otherTasks = tasks.filter((t) => t.id !== activeTaskId);
  const targetColumnTasks = otherTasks
    .filter((t) => t.status === targetStatus)
    .sort((a, b) => a.order - b.order);

  const updatedActiveTask: Task = {
    ...activeTask,
    status: targetStatus,
  };

  const insertIndex =
    typeof targetIndex === 'number' && targetIndex >= 0
      ? Math.min(targetIndex, targetColumnTasks.length)
      : targetColumnTasks.length;

  targetColumnTasks.splice(insertIndex, 0, updatedActiveTask);

  // Re-assign orders for the target column
  const orderedTargetColumnTasks = targetColumnTasks.map((task, idx) => ({
    ...task,
    order: idx,
  }));

  const remainingTasks = otherTasks.filter((t) => t.status !== targetStatus);

  return [...remainingTasks, ...orderedTargetColumnTasks];
}

/**
 * Calculate dashboard and project statistics
 */
export function calculateProjectStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inWork = tasks.filter((t) => t.status === 'IN_WORK').length;
  const qa = tasks.filter((t) => t.status === 'QA').length;
  const todo = tasks.filter((t) => t.status === 'TODO').length;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const overdue = tasks.filter(
    (t) => t.status !== 'COMPLETED' && t.dueDate && t.dueDate < todayStr
  ).length;

  const dueSoon = tasks.filter((t) => {
    if (t.status === 'COMPLETED' || !t.dueDate) return false;
    const diff = new Date(t.dueDate).getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 3;
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    inWork,
    qa,
    todo,
    overdue,
    dueSoon,
    completionRate,
  };
}

/**
 * Format date nicely e.g. "Oct 24", "Tomorrow", "Today", or "Overdue"
 */
export function formatDueDate(
  dateStr?: string,
  isCompleted?: boolean
): { text: string; isOverdue: boolean; isToday: boolean } {
  if (!dateStr) return { text: 'No due date', isOverdue: false, isToday: false };

  const targetDate = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const formatted = targetDate.toLocaleDateString('en-US', options);

  if (diffDays < 0) {
    if (isCompleted) {
      return { text: formatted, isOverdue: false, isToday: false };
    }
    return { text: `${formatted} (Overdue)`, isOverdue: true, isToday: false };
  } else if (diffDays === 0) {
    return { text: 'Today', isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false };
  }

  return { text: formatted, isOverdue: false, isToday: false };
}
