
import React from 'react';
import TasksContainer from '@/components/tasks/TasksContainer';
import TasksHeader from "@/components/tasks/TasksHeader";
import TaskDialogs from "@/components/tasks/TaskDialogs";
import TasksTabs from '@/components/tasks/TasksTabs';

const Tasks: React.FC = () => {
  return (
    <div className="p-6 space-y-6 fade-in">
      <TasksContainer>
        {({
          tasks,
          isLoading,
          isRefreshing,
          selectedTask,
          taskToDelete,
          activeTab,
          isPrioritizing,
          isDialogOpen,
          isDeleteDialogOpen,
          todoTasks,
          inProgressTasks,
          completedTasks,
          handleAddTask,
          handleEditTask,
          handleStatusChange,
          handleDeleteTask,
          openEditDialog,
          openDeleteDialog,
          handleTabChange,
          handlePrioritizeTasks,
          setIsDialogOpen,
          setIsDeleteDialogOpen,
          setSelectedTask,
          setTaskToDelete,
        }) => (
          <>
            <TasksHeader
              onAddTask={() => setIsDialogOpen(true)}
              onPrioritize={handlePrioritizeTasks}
              isPrioritizing={isPrioritizing}
              isLoading={isLoading || isRefreshing}
              disablePrioritize={tasks.filter(t => t.status !== 'completed').length < 2}
            />

            <TaskDialogs
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              selectedTask={selectedTask}
              setSelectedTask={setSelectedTask}
              taskToDelete={taskToDelete}
              setTaskToDelete={setTaskToDelete}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />

            <TasksTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              tasks={tasks}
              todoTasks={todoTasks}
              inProgressTasks={inProgressTasks}
              completedTasks={completedTasks}
              isLoading={isLoading || isRefreshing}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onStatusChange={handleStatusChange}
            />
          </>
        )}
      </TasksContainer>
    </div>
  );
};

export default Tasks;
