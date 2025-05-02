'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/utils/validation';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { CustomFormField } from '@/components/common/CustomFormField';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useState } from 'react';
import PasswordResetSuccess from '@/components/modals/PasswordResetSuccess';
import { useChangePassword } from '@/service/query/auth.service';
import { useToast } from '@/context/ToastContext';
import { ChangePasswordBody } from '@/types/auth';
import { LoaderButton } from '@/components/common/LoaderButton';

const Page = () => {
  const { isMobile } = useWindowSize();

  const email =
    typeof window !== 'undefined' ? sessionStorage.getItem('email') : null;

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      email: '',
    },
    mode: 'onTouched',
  });

  const [isOpen, setIsOpen] = useState(false);

  const { addToast } = useToast();

  const { mutate, isPending } = useChangePassword({
    onSuccess: () => {
      sessionStorage.removeItem('email');
      setIsOpen(true);
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

  function onSubmit(values: ChangePasswordBody) {
    mutate({
      email: email,
      password: values?.password,
    });
  }
  const { control, formState } = form;
  const { errors } = formState;

  return (
    <div className="pb-7">
      <h2 className="font-medium text-center text-xl md:text-[1.3rem] pt-6">
        Set New Password
      </h2>
      <p className="pt-3 text-center text-sm">
        Password must be at least 8 characters long
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8">
          <div className="flex flex-col space-y-6">
            <CustomFormField
              label="Password"
              name="password"
              control={control}
              placeholder="Enter your password"
              showPasswordToggle={true}
              isPassword={true}
              error={errors.password?.message}
            />
            <CustomFormField
              label="Confirm Password"
              name="confirmPassword"
              control={control}
              placeholder="Confirm Password"
              showPasswordToggle={true}
              isPassword={true}
              error={errors.confirmPassword?.message}
            />
          </div>
          <LoaderButton
            isLoading={isPending}
            isMobile={isMobile}
            className="w-full"
          />
        </form>
      </Form>
      <PasswordResetSuccess isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
export default Page;
