const formatKeyToLabel = (key: string): string => {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> space
    .replace(/_/g, ' ')                  // snake_case -> space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default formatKeyToLabel;