import { useNavigate } from 'react-router-dom';
import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TODO List</h2>
      <p className="text-gray-600 mb-8">Manage your tasks efficiently</p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 mb-6">Your task management system is ready to use.</p>
        <button
          onClick={() => navigate('/tasks/create')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Create New Task
        </button>
      </div>
    </div>
  );
};

export default HomePage;
