import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById } from '../slices/projectSlice';
import { 
  fetchTasks, createTask, updateTask, deleteTask 
} from '../slices/taskSlice';
import { 
  ArrowLeft, Plus, AlertCircle, CheckCircle2, Clock, X, Edit, Trash2, 
  ChevronDown, MoreHorizontal, Loader2, CalendarClock
} from 'lucide-react';

function ProjectDetails() {
  const { id: projectId } = useParams();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo'
  });
  
  const dispatch = useDispatch();
  const { currentProject } = useSelector(state => state.projects);
  const { tasks, loading, error } = useSelector(state => state.tasks);
  
  useEffect(() => {
    dispatch(getProjectById(projectId));
    dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);
  
  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'todo'
    });
    setEditingTask(null);
  };
  
  const handleOpenTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        status: task.status
      });
    } else {
      resetTaskForm();
    }
    setShowTaskModal(true);
  };
  
  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    resetTaskForm();
  };
  
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitTask = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      dispatch(updateTask({
        projectId,
        taskId: editingTask._id,
        taskData: taskForm
      }))
        .unwrap()
        .then(() => {
          handleCloseTaskModal();
        });
    } else {
      dispatch(createTask({
        projectId,
        taskData: taskForm
      }))
        .unwrap()
        .then(() => {
          handleCloseTaskModal();
        });
    }
  };
  
  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask({ projectId, taskId }));
  };
  
  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    try {
      await dispatch(
        updateTask({
          projectId,
          taskId,
          taskData: { ...task, status: newStatus },
        })
      ).unwrap();
      dispatch(fetchTasks(projectId)); // Refresh tasks after update
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };
  
  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    inProgress: tasks.filter(task => task.status === 'inProgress'),
    completed: tasks.filter(task => task.status === 'completed')
  };
 
  if (!currentProject && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="rounded-full bg-red-50 p-3 mx-auto w-16 h-16 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-800">Project Not Found</h2>
          <p className="mt-3 text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link 
            to="/dashboard"
            className="mt-6 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4 text-gray-500 hover:text-gray-900 transition-colors duration-200">
              <div className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft size={20} />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{currentProject?.name || 'Loading...'}</h1>
          </div>
          <button
            onClick={() => handleOpenTaskModal()}
            className="flex items-center cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProject && (
          <>
            {currentProject.description && (
              <div className="mb-8 bg-white shadow-sm rounded-lg p-5 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Project Description</h3>
                <p className="text-gray-700">{currentProject.description}</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <Loader2 size={40} className="animate-spin mx-auto text-blue-600" />
                <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
              </div>
            ) : tasks.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
               
                <TaskColumn 
                  title="To Do"
                  icon={<Clock size={18} className="text-gray-500" />}
                  tasks={tasksByStatus.todo}
                  onEditTask={handleOpenTaskModal}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleUpdateStatus}
                  badgeColor="bg-gray-100 text-gray-800"
                />
                
               
                <TaskColumn 
                  title="In Progress"
                  icon={<ChevronDown size={18} className="text-blue-500" />}
                  tasks={tasksByStatus.inProgress}
                  onEditTask={handleOpenTaskModal}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleUpdateStatus}
                  badgeColor="bg-blue-100 text-blue-800"
                />
                
                <TaskColumn 
                  title="Completed"
                  icon={<CheckCircle2 size={18} className="text-green-500" />}
                  tasks={tasksByStatus.completed}
                  onEditTask={handleOpenTaskModal}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleUpdateStatus}
                  badgeColor="bg-green-100 text-green-800"
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="rounded-full bg-gray-100 p-4 mx-auto w-20 h-20 flex items-center justify-center">
                  <AlertCircle size={32} className="text-gray-400" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-gray-800">No tasks yet</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Create your first task to get started with this project.
                </p>
                <button
                  onClick={() => handleOpenTaskModal()}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200"
                >
                  <Plus size={18} />
                  Add Task
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
     
      {showTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button 
                onClick={handleCloseTaskModal}
                className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask}>
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="taskTitle">
                  Task Title
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  name="title"
                  value={taskForm.title}
                  onChange={handleTaskFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="taskDescription">
                  Description
                </label>
                <textarea
                  id="taskDescription"
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter task description"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="taskStatus">
                  Status
                </label>
                <div className="relative">
                  <select
                    id="taskStatus"
                    name="status"
                    value={taskForm.status}
                    onChange={handleTaskFormChange}
                    className="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseTaskModal}
                  className="px-4 py-2.5 cursor-pointer border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskColumn({ title, icon, tasks, onEditTask, onDeleteTask, onStatusChange, badgeColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="bg-gray-50 px-5 py-4 border-b">
        <h3 className="font-medium text-gray-800 flex items-center">
          <span className="mr-2">{icon}</span>
          {title} ({tasks.length})
        </h3>
      </div>
      <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task._id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task._id)}
              onStatusChange={onStatusChange}
              badgeColor={badgeColor}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No tasks in this category
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock size={12} className="mr-1" />
            To Do
          </span>
        );
      case 'inProgress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ChevronDown size={12} className="mr-1" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 size={12} className="mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(date);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task._id, newStatus);
    setShowDropdown(false);
  };
 
  useEffect(() => {
    if (showDropdown) {
      const handleOutsideClick = (e) => {
        if (!e.target.closest('.task-dropdown')) {
          setShowDropdown(false);
        }
      };
      
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [showDropdown]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-800 text-lg leading-tight">{task.title}</h4>
        
        <div className="flex items-center space-x-1 task-dropdown">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 rounded-full cursor-pointer
             hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-5 mt-8 w-56 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
              <button
                onClick={onEdit}
                className="flex items-center cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Edit size={16} className="mr-2 text-gray-500" />
                Edit Task
              </button>
              
              <button
                onClick={() => onDelete(task._id)}
                className="flex items-center cursor-pointer px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Task
              </button>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              {task.status !== 'inProgress' && (
                <button
                  onClick={() => handleStatusChange('inProgress')}
                  className="flex items-center cursor-pointer px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
                >
                  <ChevronDown size={16} className="mr-2" />
                  Move to In Progress
                </button>
              )}
              
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="flex items-center cursor-pointer px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Mark as Completed
                </button>
              )}
              
              {task.status !== 'todo' && (
                <button
                  onClick={() => handleStatusChange('todo')}
                  className="flex items-center cursor-pointer px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 w-full text-left"
                >
                  <Clock size={16} className="mr-2" />
                  Move to To Do
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mt-1 mb-3">{task.description}</p>
      )}
      
      <div className="flex justify-between items-center mt-4">
        {getStatusBadge(task.status)}
        
        <div className="text-xs text-gray-500 flex items-center">
          <CalendarClock size={12} className="mr-1" />
          {task.completedAt
            ? `Completed: ${formatDate(task.completedAt)}`
            : `Created: ${formatDate(task.createdAt)}`}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;