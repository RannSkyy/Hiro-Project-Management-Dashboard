import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortTasks,
  groupTasksByColumn,
  reorderOrMoveTask,
  calculateProjectStats,
  formatDueDate,
} from './taskLogic';
import { Task, FilterState } from '../types';

const mockTasks: Task[] = [
  {
    id: 't-1',
    projectId: 'p-1',
    title: 'Design UI Tokens',
    description: 'Set up color palette and fonts',
    status: 'TODO',
    priority: 'HIGH',
    category: 'Design',
    categoryColor: '#3B82F6',
    assigneeIds: ['u-1', 'u-2'],
    dueDate: '2026-11-15',
    createdAt: '2026-11-01',
    order: 0,
    likes: 3,
    subtasks: [{ id: 's-1', title: 'Colors', completed: true }],
    attachments: [],
    comments: [],
  },
  {
    id: 't-2',
    projectId: 'p-1',
    title: 'Implement Kanban Board',
    description: 'Build dnd-kit columns',
    status: 'IN_WORK',
    priority: 'URGENT',
    category: 'Development',
    categoryColor: '#8B5CF6',
    assigneeIds: ['u-1'],
    dueDate: '2026-11-10',
    createdAt: '2026-11-02',
    order: 0,
    likes: 5,
    subtasks: [],
    attachments: [],
    comments: [],
  },
  {
    id: 't-3',
    projectId: 'p-1',
    title: 'Quality Assurance Testing',
    description: 'Cross-browser check on mobile and tablet',
    status: 'QA',
    priority: 'MEDIUM',
    category: 'QA',
    categoryColor: '#F59E0B',
    assigneeIds: ['u-3'],
    dueDate: '2026-11-20',
    createdAt: '2026-11-03',
    order: 0,
    likes: 1,
    subtasks: [],
    attachments: [],
    comments: [],
  },
  {
    id: 't-4',
    projectId: 'p-1',
    title: 'Setup Repository',
    description: 'Initial repo setup',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'DevOps',
    categoryColor: '#10B981',
    assigneeIds: ['u-2'],
    dueDate: '2026-11-05',
    createdAt: '2026-11-01',
    order: 0,
    likes: 4,
    subtasks: [],
    attachments: [],
    comments: [],
  },
];

const defaultFilters: FilterState = {
  searchQuery: '',
  onlyMy: false,
  category: 'ALL',
  priority: 'ALL',
  assigneeId: 'ALL',
  sortBy: 'order',
};

test('filterAndSortTasks: filters by search query matching title and description', () => {
  const resultTitle = filterAndSortTasks(mockTasks, { ...defaultFilters, searchQuery: 'kanban' }, 'u-1', 'p-1');
  assert.equal(resultTitle.length, 1);
  assert.equal(resultTitle[0].id, 't-2');

  const resultDesc = filterAndSortTasks(mockTasks, { ...defaultFilters, searchQuery: 'palette' }, 'u-1', 'p-1');
  assert.equal(resultDesc.length, 1);
  assert.equal(resultDesc[0].id, 't-1');
});

test('filterAndSortTasks: onlyMy filter matches current user tasks', () => {
  const onlyUserOne = filterAndSortTasks(mockTasks, { ...defaultFilters, onlyMy: true }, 'u-1', 'p-1');
  assert.equal(onlyUserOne.length, 2);
  assert.ok(onlyUserOne.some((t) => t.id === 't-1'));
  assert.ok(onlyUserOne.some((t) => t.id === 't-2'));
});

test('filterAndSortTasks: category and priority filters', () => {
  const devTasks = filterAndSortTasks(mockTasks, { ...defaultFilters, category: 'Development' }, 'u-1', 'p-1');
  assert.equal(devTasks.length, 1);
  assert.equal(devTasks[0].id, 't-2');

  const urgentTasks = filterAndSortTasks(mockTasks, { ...defaultFilters, priority: 'URGENT' }, 'u-1', 'p-1');
  assert.equal(urgentTasks.length, 1);
  assert.equal(urgentTasks[0].id, 't-2');
});

test('groupTasksByColumn: correctly distributes tasks into 4 kanban columns', () => {
  const groups = groupTasksByColumn(mockTasks);
  assert.equal(groups.TODO.length, 1);
  assert.equal(groups.IN_WORK.length, 1);
  assert.equal(groups.QA.length, 1);
  assert.equal(groups.COMPLETED.length, 1);
});

test('reorderOrMoveTask: moves task across columns and updates status and order', () => {
  const moved = reorderOrMoveTask(mockTasks, 't-1', 'IN_WORK', 0);
  const updatedTask = moved.find((t) => t.id === 't-1');
  assert.equal(updatedTask?.status, 'IN_WORK');
  assert.equal(updatedTask?.order, 0);

  const inWorkTasks = moved.filter((t) => t.status === 'IN_WORK');
  assert.equal(inWorkTasks.length, 2);
});

test('calculateProjectStats: calculates completion rate and counts correctly', () => {
  const stats = calculateProjectStats(mockTasks);
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 1);
  assert.equal(stats.inWork, 1);
  assert.equal(stats.qa, 1);
  assert.equal(stats.todo, 1);
  assert.equal(stats.completionRate, 25);
});

test('formatDueDate: handles missing and formats valid dates correctly', () => {
  assert.equal(formatDueDate(undefined).text, 'No due date');
  const valid = formatDueDate('2026-11-20');
  assert.ok(valid.text.length > 0);
});
