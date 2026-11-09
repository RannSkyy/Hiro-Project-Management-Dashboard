import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Project,
  Member,
  ViewMode,
  NavigationItem,
  FilterState,
  ColumnId,
  ActivityItem,
  ProjectGoal,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_GOALS,
} from '../data/initialData';
import { reorderOrMoveTask } from '../utils/taskLogic';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Active Project & Navigation
  activeNav: NavigationItem;
  setActiveNav: (nav: NavigationItem) => void;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  activeProject: Project | undefined;
  projects: Project[];
  toggleProjectFavorite: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Views
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // User
  currentUser: Member;
  setCurrentUser: (member: Member) => void;
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;

  // Tasks
  tasks: Task[];
  projectTasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'likes'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: ColumnId, targetIndex?: number) => void;
  toggleTaskLike: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, text: string) => void;

  // Goals & Activities
  goals: ProjectGoal[];
  createGoal: (goal: Omit<ProjectGoal, 'id'>) => void;
  activities: ActivityItem[];

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Modals & UI
  selectedTaskId: string | null;
  isTaskModalOpen: boolean;
  taskModalInitialStatus: ColumnId;
  openCreateTaskModal: (status?: ColumnId) => void;
  openEditTaskModal: (taskId: string) => void;
  closeTaskModal: () => void;

  isNewProjectModalOpen: boolean;
  openNewProjectModal: () => void;
  closeNewProjectModal: () => void;

  isShareModalOpen: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;

  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Notifications drawer
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Reset
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'hiro_theme',
  TASKS: 'hiro_tasks_v2',
  PROJECTS: 'hiro_projects_v2',
  MEMBERS: 'hiro_members_v2',
  GOALS: 'hiro_goals_v2',
  ACTIVITIES: 'hiro_activities_v2',
  ACTIVE_PROJECT: 'hiro_active_proj',
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  onlyMy: false,
  category: 'ALL',
  priority: 'ALL',
  assigneeId: 'ALL',
  sortBy: 'order',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved !== null) return saved === 'dark';
      return false; // Light default as per PRD "Background putih dengan aksen abu-abu muda #F1F3F8"
    } catch {
      return false;
    }
  });

  // Sync dark class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Members
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<Member>(() => members[0] || INITIAL_MEMBERS[0]);

  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
      return saved || 'proj-hikoko';
    } catch {
      return 'proj-hikoko';
    }
  });

  // Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Goals
  const [goals, setGoals] = useState<ProjectGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // Activities
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Active navigation and view mode
  const [activeNav, setActiveNav] = useState<NavigationItem>('projects');
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskModalInitialStatus, setTaskModalInitialStatus] = useState<ColumnId>('TODO');

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, activeProjectId);
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Project Actions
  const toggleProjectFavorite = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedFav = !p.isFavorite;
          showToast(updatedFav ? `Added "${p.name}" to favorites` : `Removed "${p.name}" from favorites`, 'info');
          return { ...p, isFavorite: updatedFav };
        }
        return p;
      })
    );
  };

  const createProject = (newProjData: Omit<Project, 'id' | 'createdAt'>) => {
    const id = 'proj-' + Date.now().toString(36);
    const newProject: Project = {
      ...newProjData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(id);
    setActiveNav('projects');
    showToast(`Project "${newProject.name}" created successfully!`, 'success');
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Project updated', 'info');
  };

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      showToast('Cannot delete the last remaining project', 'warning');
      return;
    }
    const target = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProjectId(remaining[0]?.id || '');
    }
    showToast(`Deleted project "${target?.name || ''}"`, 'info');
  };

  // Task Actions
  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order' | 'likes'>) => {
    const id = 'task-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      order: tasks.filter((t) => t.projectId === taskData.projectId && t.status === taskData.status).length,
      likes: 0,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add activity
    const newActivity: ActivityItem = {
      id: 'act-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'created task',
      target: newTask.title,
      timestamp: 'Just now',
      projectId: newTask.projectId,
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Task "${newTask.title}" added to ${taskData.status}`, 'success');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updates };
        }
        return t;
      })
    );
    showToast('Task updated successfully', 'success');
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted task "${target?.title || ''}"`, 'info');
  };

  const moveTask = (taskId: string, targetStatus: ColumnId, targetIndex?: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const previousStatus = task.status;
    const reordered = reorderOrMoveTask(tasks, taskId, targetStatus, targetIndex);
    setTasks(reordered);

    // If moved to COMPLETED and previously wasn't, trigger festive confetti celebration!
    if (targetStatus === 'COMPLETED' && previousStatus !== 'COMPLETED') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#2563EB', '#F59E0B', '#8B5CF6'],
        });
      } catch {
        // Safe fallback
      }
      showToast(`🎉 Great job! "${task.title}" is now COMPLETED!`, 'success');
    }

    // Add activity log
    if (previousStatus !== targetStatus) {
      const newActivity: ActivityItem = {
        id: 'act-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action: `moved task to ${targetStatus}`,
        target: task.title,
        timestamp: 'Just now',
        projectId: task.projectId,
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 30)]);
    }
  };

  const toggleTaskLike = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isLiked = !t.isLiked;
          return {
            ...t,
            isLiked,
            likes: isLiked ? t.likes + 1 : Math.max(0, t.likes - 1),
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const addComment = (taskId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: 'c-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Just now',
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, comments: [...t.comments, newComment] };
        }
        return t;
      })
    );
    showToast('Comment added', 'info');
  };

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const id = 'user-' + Date.now().toString(36);
    const newMember: Member = { ...memberData, id };
    setMembers((prev) => [...prev, newMember]);
    // Also add to active project
    if (activeProject) {
      updateProject(activeProject.id, {
        memberIds: [...activeProject.memberIds, id],
      });
    }
    showToast(`Invited ${newMember.name} to team`, 'success');
  };

  const createGoal = (goalData: Omit<ProjectGoal, 'id'>) => {
    const newGoal: ProjectGoal = {
      ...goalData,
      id: 'goal-' + Date.now().toString(36),
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast('Goal created', 'success');
  };

  const openCreateTaskModal = (status: ColumnId = 'TODO') => {
    setSelectedTaskId(null);
    setTaskModalInitialStatus(status);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  const openNewProjectModal = () => setIsNewProjectModalOpen(true);
  const closeNewProjectModal = () => setIsNewProjectModalOpen(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setMembers(INITIAL_MEMBERS);
    setGoals(INITIAL_GOALS);
    setActivities(INITIAL_ACTIVITIES);
    setActiveProjectId('proj-hikoko');
    setActiveNav('projects');
    resetFilters();
    showToast('Reset to demo workspace data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        activeNav,
        setActiveNav,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        projects,
        toggleProjectFavorite,
        createProject,
        updateProject,
        deleteProject,
        viewMode,
        setViewMode,
        currentUser,
        setCurrentUser,
        members,
        addMember,
        tasks,
        projectTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleTaskLike,
        toggleSubtask,
        addComment,
        goals,
        createGoal,
        activities,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        selectedTaskId,
        isTaskModalOpen,
        taskModalInitialStatus,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        isNewProjectModalOpen,
        openNewProjectModal,
        closeNewProjectModal,
        isShareModalOpen,
        openShareModal,
        closeShareModal,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        toasts,
        showToast,
        dismissToast,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
