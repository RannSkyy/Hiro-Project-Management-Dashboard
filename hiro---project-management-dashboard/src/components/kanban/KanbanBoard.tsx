import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useApp } from '../../context/AppContext';
import { ColumnId, Task } from '../../types';
import { COLUMNS, filterAndSortTasks, groupTasksByColumn } from '../../utils/taskLogic';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    activeProjectId,
    filters,
    currentUser,
    moveTask,
  } = useApp();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Setup sensors with small distance constraint to distinguish click vs drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks for active project
  const filteredTasks = filterAndSortTasks(
    tasks,
    filters,
    currentUser.id,
    activeProjectId
  );

  const columnGroups = groupTasksByColumn(filteredTasks);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional smooth ghost positioning if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    // Check if dropped directly over a column container
    if (COLUMNS.includes(overId as ColumnId)) {
      const targetColumn = overId as ColumnId;
      if (draggedTask.status !== targetColumn) {
        moveTask(activeId, targetColumn);
      }
      return;
    }

    // Dropped over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      const targetColumn = overTask.status;
      const targetColumnTasks = tasks
        .filter((t) => t.status === targetColumn && t.projectId === activeProjectId)
        .sort((a, b) => a.order - b.order);

      const targetIndex = targetColumnTasks.findIndex((t) => t.id === overId);
      moveTask(activeId, targetColumn, targetIndex >= 0 ? targetIndex : undefined);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto p-4 md:p-8 bg-[#F1F3F8] dark:bg-slate-950/60 min-h-[calc(100vh-140px)]">
        <div className="flex items-start gap-5 min-w-max pb-6">
          {COLUMNS.map((colId) => (
            <KanbanColumn
              key={colId}
              columnId={colId}
              tasks={columnGroups[colId] || []}
            />
          ))}
        </div>
      </div>

      {/* Drag Overlay for smooth visual feedback */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
