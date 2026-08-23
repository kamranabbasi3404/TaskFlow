import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, Workspace, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface TaskKanbanBoardProps {
  tasks: Task[];
  workspaces: Workspace[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onAddNewTask: (statusPreset?: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; icon: React.ReactNode; colorClass: string }[] = [
  {
    id: 'To Do',
    title: 'To Do',
    icon: <Circle className="h-4 w-4 text-slate-400" />,
    colorClass: 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    icon: <Clock className="h-4 w-4 text-indigo-500" />,
    colorClass: 'border-indigo-200/50 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20',
  },
  {
    id: 'Done',
    title: 'Done',
    icon: <CheckCircle2 className="h-4 w-4 text-teal-500" />,
    colorClass: 'border-teal-200/50 dark:border-teal-900/40 bg-teal-50/30 dark:bg-teal-950/20',
  },
];

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  workspaces,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNewTask,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    onStatusChange(draggableId, newStatus);
  };

  const getWorkspaceForTask = (workspaceId: string) => {
    return workspaces.find((w) => w._id === workspaceId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);

          return (
            <div
              key={column.id}
              className={`flex flex-col rounded-2xl border ${column.colorClass} p-4 min-h-[500px] shadow-sm transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {column.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {columnTasks.length}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddNewTask(column.id)}
                  title={`Add new task to ${column.title}`}
                  className="p-1 h-7 w-7 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Droppable Zone */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-3 rounded-xl transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-indigo-500/10 ring-2 ring-indigo-500/20' : ''
                    }`}
                  >
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="text-xs font-medium">No tasks in {column.title}</p>
                        <button
                          onClick={() => onAddNewTask(column.id)}
                          className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          + Add a task
                        </button>
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={`transition-transform ${
                                snapshot.isDragging ? 'rotate-1 scale-105 z-50 shadow-2xl' : ''
                              }`}
                            >
                              <TaskCard
                                task={task}
                                workspace={getWorkspaceForTask(task.workspaceId)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
