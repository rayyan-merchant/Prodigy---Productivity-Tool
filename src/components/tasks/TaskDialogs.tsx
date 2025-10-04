
import React from 'react';
import { Task } from "@/components/TaskCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TaskForm from "@/components/TaskForm";

interface TaskDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  taskToDelete: string | null;
  setTaskToDelete: (id: string | null) => void;
  onAddTask: (values: any) => void;
  onEditTask: (values: any) => void;
  onDeleteTask: () => void;
}

const TaskDialogs: React.FC<TaskDialogsProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedTask,
  setSelectedTask,
  taskToDelete,
  setTaskToDelete,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={selectedTask ? onEditTask : onAddTask}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedTask(null);
            }}
            initialData={selectedTask}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteTask}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskDialogs;
