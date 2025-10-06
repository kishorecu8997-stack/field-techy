import { FormProvider, type FieldValues, type UseFormReturn, } from "react-hook-form";

interface FormContainerProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
}

export const FormContainer = <T extends FieldValues>({
  methods,
  onSubmit,
  children,
  className,
}: FormContainerProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};