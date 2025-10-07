import { FormProvider, type FieldValues, type UseFormReturn, } from "react-hook-form";

/**
 * Props for FormContainer - a simple wrapper that connects react-hook-form
 * methods to a native <form> via FormProvider and handleSubmit.
 *
 * @template T - the shape of the form values (react-hook-form FieldValues)
 * @property {UseFormReturn<T>} methods - the return value of useForm<T>()
 * @property {(data: T) => void} onSubmit - submit handler called with validated data
 * @property {React.ReactNode} children - form fields / UI to render inside the form
 * @property {string} [className] - optional className to apply to the <form>
 */
interface FormContainerProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormContainer
 *
 * A small, reusable form wrapper that provides react-hook-form context
 * to child components using <FormProvider> and wires up the native
 * <form>'s onSubmit to react-hook-form's handleSubmit.
 *
 * Use this component anywhere you need to render a form driven by
 * react-hook-form. It keeps the common boilerplate in a single place.
 *
 * @example
 * const methods = useForm({ defaultValues: { email: "" }});
 * return (
 *   <FormContainer methods={methods} onSubmit={data => console.log(data)}>
 *     <input {...methods.register('email')} />
 *   </FormContainer>
 * )
 *
 * @param {FormContainerProps<T>} props
 * @returns {JSX.Element}
 */
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