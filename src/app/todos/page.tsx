'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { todoApi, Todo, getErrorMessage } from '@/lib/api';
import Toast from '@/components/Toast';
import { FullPageLoader } from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    todoId: number | null;
    todoTitle: string;
  }>({
    isOpen: false,
    todoId: null,
    todoTitle: '',
  });
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchTodos();
  }, [isAuthenticated, router]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newTodo = await todoApi.create({ title, description, priority });
      setTodos([...todos, newTodo]);
      setSuccess('Todo created successfully!');
      setTitle('');
      setDescription('');
      setPriority(1);
      setShowAddForm(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const updatedTodo = await todoApi.toggleComplete(id);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setSuccess('Todo updated successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setSuccess('Todo deleted successfully!');
      setDeleteConfirm({ isOpen: false, todoId: null, todoTitle: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setDeleteConfirm({
      isOpen: true,
      todoId: id,
      todoTitle: title,
    });
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-blue-100 text-blue-800 border-blue-300';
      case 2: return 'bg-green-100 text-green-800 border-green-300';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 4: return 'bg-orange-100 text-orange-800 border-orange-300';
      case 5: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Lowest';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Highest';
      default: return 'Unknown';
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
        {success && <Toast message={success} type="success" onClose={() => setSuccess(null)} />}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Delete Todo"
          message={`Are you sure you want to delete "${deleteConfirm.todoTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={() => deleteConfirm.todoId && handleDeleteTodo(deleteConfirm.todoId)}
          onCancel={() => setDeleteConfirm({ isOpen: false, todoId: null, todoTitle: '' })}
        />

        {/* Header */}
        <div className="mb-8 md:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text">
                My Todos
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                Manage your tasks and stay organized
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm md:text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {showAddForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Todo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="mb-8 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 animate-scale-in">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Todo</h2>
            <form onSubmit={handleAddTodo} className="space-y-5">
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Enter todo title"
                />
              </div>

              <div className="group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm resize-none"
                  placeholder="Enter todo description"
                />
              </div>

              <div className="group">
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm cursor-pointer"
                >
                  <option value={1}>Lowest</option>
                  <option value={2}>Low</option>
                  <option value={3}>Medium</option>
                  <option value={4}>High</option>
                  <option value={5}>Highest</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Todo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Todos List */}
        {todos.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <svg
                  className="h-10 w-10 md:h-12 md:w-12 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">No todos yet</h3>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Get started by creating your first todo and stay organized!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6 animate-fade-in">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className={`group bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl p-6 md:p-8 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 ${
                  todo.complete ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={todo.complete}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-md border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-indigo-600 peer-checked:border-transparent transition-all duration-200 flex items-center justify-center">
                        {todo.complete && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg md:text-xl font-bold mb-2 ${
                      todo.complete 
                        ? 'line-through text-gray-400 dark:text-gray-500' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {todo.title}
                    </h3>
                    <p className={`text-sm md:text-base mb-4 ${
                      todo.complete 
                        ? 'line-through text-gray-400 dark:text-gray-500' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {todo.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getPriorityColor(todo.priority)}`}>
                        <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: 'currentColor' }}></span>
                        {getPriorityLabel(todo.priority)} Priority
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => openDeleteConfirm(todo.id, todo.title)}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl focus:outline-none transition-all duration-200 group-hover:opacity-100 opacity-60"
                    aria-label="Delete todo"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
