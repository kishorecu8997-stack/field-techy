// Reusable Badge
type BadgeVariant =
  | "green"
  | "blue"
  | "purple"
  | "yellow"
  | "teal"
  | "gray"
  | "amber"
  | "red"
  | "rose"
  | "pink";

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: BadgeVariant;
}> = ({ children, variant = "gray" }) => {
  const styles = {
    green:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    purple:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    yellow:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    amber:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    rose: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
