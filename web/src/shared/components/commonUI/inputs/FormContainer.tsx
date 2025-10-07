import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
  type SubmitHandler,
} from "react-hook-form";

/**
 * Props for the FormContainer component
 * @template T - The form data type extending FieldValues
 */
interface FormContainerProps<T extends FieldValues> {
  /**
   * React Hook Form methods object containing form state, validation, and handlers
   * @type {UseFormReturn<T>}
   */
  methods: UseFormReturn<T>;
  
  /**
   * Optional callback function called when the form is submitted with valid data
   * @param {T} data - The validated form data
   * @returns {void}
   * @optional
   */
  onSubmit?: (data: T) => void;
  
  /**
   * React children elements to be rendered inside the form
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
  
  /**
   * Optional CSS class name to apply to the form element
   * @type {string}
   * @optional
   */
  className?: string;
}

export const FormContainer = <T extends FieldValues>({
  methods,
  onSubmit,
  children,
  className,
}: FormContainerProps<T>) => {
  const handleSubmit: SubmitHandler<T> = onSubmit
    ? onSubmit
    : (data) => {
        console.warn("Form submitted but no onSubmit handler provided", data);
      };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};
