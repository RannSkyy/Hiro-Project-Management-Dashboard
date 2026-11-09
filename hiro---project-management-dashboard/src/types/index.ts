export type ColumnId = 'TODO' | 'IN_WORK' | 'QA' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: 'active' | 'offline' | 'busy';
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'link';
  size?: string;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ColumnId;
  priority: Priority;
  category: string;
  categoryColor: string;
  assigneeIds: string[];
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
  order: number;
  coverImage?: string;
  likes: number;
  isLiked?: boolean;
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: TaskComment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isFavorite: boolean;
  memberIds: string[];
  createdAt: string;
  targetDate?: string;
  category: string;
}

export type ViewMode = 'board' | 'list' | 'calendar';

export type NavigationItem = 'home' | 'my-tasks' | 'goals' | 'members' | 'projects';

export interface FilterState {
  searchQuery: string;
  onlyMy: boolean;
  category: string;
  priority: string;
  assigneeId: string;
  sortBy: 'order' | 'dueDate' | 'priority' | 'title';
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  projectId: string;
}

export interface ProjectGoal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  ownerId: string;
  metrics: string;
}
