import { SearchX } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-screen text-primary">
      <h1 className="text-2xl flex">
        {' '}
        <strong className="flex gap-1 mr-1">
          <SearchX color="red" />
          404
        </strong>{' '}
        - Page Not Found
      </h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
