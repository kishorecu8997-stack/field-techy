const UserSection = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
          alt="User"
          className="h-10 w-10 rounded-full bg-white"
        />
        <div className="text-sm font-medium text-gray-900">Alex</div>
      </div>
    </div>
  );
};

export default UserSection;
