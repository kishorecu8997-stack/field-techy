export function createPathBuilder(pathTemplate: string) {
  return (params: Record<string, string | number>) => {
    let path = pathTemplate;
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, String(value));
    }
    return path;
  };
}