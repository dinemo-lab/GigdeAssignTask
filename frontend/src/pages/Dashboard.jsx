import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProjects,
  createProject,
  deleteProject,
} from "../slices/projectSlice";
import { logout } from "../slices/authSlice";
import {
  Plus,
  Folder,
  LogOut,
  ChevronRight,
  AlertCircle,
  X,
  Loader2,
  CalendarClock,
  ListTodo,
  User,
  Search
} from "lucide-react";

function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
    setShowConfirmDelete(null);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    dispatch(
      createProject({ name: projectName, description: projectDescription })
    )
      .unwrap()
      .then(() => {
        setShowCreateModal(false);
        setProjectName("");
        setProjectDescription("");
      });
  };

 
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
       
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Task Tracker</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center p-2 bg-gray-50 rounded-full text-gray-700">
              <User size={18} className="text-gray-500 mr-2" />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="ml-1 hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
            <p className="text-gray-600 mt-1">Manage and organize your tasks efficiently</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            {projects.length < 4 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm w-full sm:w-auto"
              >
                <Plus size={18} />
                <span>New Project</span>
              </button>
            )}
          </div>
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
            <p className="mt-4 text-gray-600 font-medium">Loading your projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDeleteConfirm={() => setShowConfirmDelete(project._id)}
                isConfirmingDelete={showConfirmDelete === project._id}
                onDeleteCancel={() => setShowConfirmDelete(null)}
                onDelete={() => handleDeleteProject(project._id)}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <AlertCircle size={40} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-800">
              No matching projects found
            </h3>
            <p className="mt-1 text-gray-600">
              Try adjusting your search or clear the search field
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex cursor-pointer items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="rounded-full bg-gray-100 p-4 mx-auto w-20 h-20 flex items-center justify-center">
              <Folder size={32} className="text-gray-400" />
            </div>
            <h3 className="mt-5 text-xl font-medium text-gray-800">
              No projects yet
            </h3>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Create a new project to get started tracking your tasks efficiently.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200"
            >
              <Plus size={18} />
              Create Project
            </button>
          </div>
        )}

        {projects.length >= 4 && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md flex items-center">
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Project limit reached</p>
              <p className="text-sm mt-1">You've reached the maximum limit of 4 projects. Remove a project before creating a new one.</p>
            </div>
          </div>
        )}
      </main>

      
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Create New Project
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="projectName"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="projectDescription"
                >
                  Description (optional)
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter project description"
                  rows="4"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 cursor-pointer border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onDeleteConfirm, isConfirmingDelete, onDeleteCancel, onDelete }) {
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-50 text-blue-600 mr-3">
              <Folder size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
          </div>
          
          {isConfirmingDelete ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onDeleteCancel}
                className="p-1.5 rounded cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onDeleteConfirm}
                className="p-1.5 rounded-full cursor-pointer hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        
        {project.description && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <ListTodo size={16} className="mr-1.5 text-gray-500" />
            <span>{project.tasks?.length || 0} Tasks</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <CalendarClock size={14} className="mr-1.5" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <Link
        to={`/projects/${project._id}`}
        className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-3 text-center text-blue-600 font-medium border-t border-gray-200"
      >
        View Project <ChevronRight size={16} className="inline ml-1" />
      </Link>
    </div>
  );
}

export default Dashboard;