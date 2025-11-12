import type { HomePageProps } from './types';

export const HomePage = (props: HomePageProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to TODO List</h2>
      <p className="text-gray-600 mb-8">Manage your tasks efficiently</p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">Your task management system is ready to use.</p>
      </div>
    </div>
  );
};

export default HomePage;
