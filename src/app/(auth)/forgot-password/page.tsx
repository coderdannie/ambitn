'use client';

import { CustomFormField } from '@/components/common/CustomFormField';
import { LoaderButton } from '@/components/common/LoaderButton';
import { Form } from '@/components/ui/form';
import { useToast } from '@/context/ToastContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useForgotPassword } from '@/service/query/auth.service';
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

const ResetPassword = () => {
  const router = useRouter();

  const { isMobile } = useWindowSize();

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const { addToast } = useToast();
  const { control, formState } = form;
  const { errors } = formState;

  const { mutate, isPending } = useForgotPassword({
    onSuccess: (res: ForgotPasswordResponse) => {
      router.push('/verify-email');
      sessionStorage.setItem('email', form.getValues('email'));
      sessionStorage.setItem('type', 'password');
      addToast(res.message || 'OTP sent successfully', 'success');
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      addToast(
        error?.response?.data?.message || error?.message || 'An Error Occurred',
        'error'
      );
    },
  });
  function onSubmit(values: ForgotPasswordSchemaType) {
    mutate(values);
  }

  return (
    <div className=" pb-[60px]  md:pb-12">
      <div className="text-center">
        <h2 className="text-primary text-xl md:text-2xl font-medium pt-8 pb-2">
          Password Reset
        </h2>
        <p className="text-sm md:text-base">
          Enter the Email address you used to register
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" pt-8">
          <div className="flex flex-col space-y-6">
            <CustomFormField
              label="email address"
              name="email"
              control={control}
              placeholder="Enter your email address"
              error={errors.email?.message}
            />
          </div>

          {/* Submit Button */}
          <LoaderButton
            isLoading={isPending}
            isMobile={isMobile}
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
};
export default ResetPassword;
