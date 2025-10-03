import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
  type SubmitHandler,
} from "react-hook-form";

interface FormContainerProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit?: (data: T) => void;
  children: React.ReactNode;
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
