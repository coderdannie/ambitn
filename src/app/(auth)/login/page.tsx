'use client';

import { CustomFormField } from '@/components/common/CustomFormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, LoginSchemaType } from '@/utils/validation';
import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useWindowSize } from '@/hooks/useWindowSize';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useLogin } from '@/service/query/auth.service';
import { LoaderButton } from '@/components/common/LoaderButton';

const LoginPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { isMobile } = useWindowSize();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { control, formState } = form;
  const { errors } = formState;

  const { mutate, isPending } = useLogin({
    onSuccess: (res: LoginResponse) => {
      sessionStorage.setItem('user', JSON.stringify(res));
      addToast(res.message, 'success');
      setTimeout(() => {
        if (!res?.data?.hasSelectedTopics) {
          router.push('/account-setup');
        } else {
          router.push('/discover');
        }
      }, 200);
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

  function onSubmit(values: LoginSchemaType) {
    mutate(values);
  }

  return (
    <div className="text-primary">
      <h1 className="font-medium md:text-2xl">Welcome Back</h1>
      <p>Join us now and start your job hunt journey with us.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" pt-8">
          {/* Email Field */}
          <div className="flex flex-col space-y-6">
            <CustomFormField
              label="email address"
              name="email"
              control={control}
              placeholder="Valid email required"
              error={errors.email?.message}
            />
            <CustomFormField
              label="password"
              name="password"
              control={control}
              placeholder="Enter your password"
              error={errors.password?.message}
              showPasswordToggle
              isPassword
            />
          </div>
          <Link
            className="flex justify-end w-fit ml-auto mt-3 hover:underline font-medium"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
          {/* Submit Button */}
          <LoaderButton isLoading={isPending} isMobile={isMobile} />
        </form>

        {isMobile && (
          <div className="flex items-center mt-[18px] mb-2">
            <hr className="flex-1 border-t border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm font-semibold">
              Or Continue with
            </span>
            <hr className="flex-1 border-t border-gray-300" />
          </div>
        )}
        <div
          className={`flex justify-center  gap-2 ${
            isMobile ? 'flex-row' : 'flex-col'
          }`}
        >
          <div
            className={`flex items-center gap-2 justify-center border border-[#E8E8E8] border-dashed py-4 ${
              isMobile ? 'border-0' : 'border'
            }`}
          >
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${
                isMobile
                  ? 'border[#E8E8E8] border p-4 w-[54px] h-[42px]'
                  : 'border-0 '
              }`}
            >
              <Image
                src="/assets/googleIcon.png"
                alt="google icon"
                width={20}
                height={20}
              />
              {!isMobile && <span>Continue with Google</span>}
            </Button>
          </div>
          <div
            className={`flex items-center gap-2 justify-center border border-[#E8E8E8] border-dashed py-4 ${
              isMobile ? 'border-0' : 'border'
            }`}
          >
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${
                isMobile
                  ? 'border[#E8E8E8] border p-4 w-[54px] h-[42px]'
                  : 'border-0 '
              }`}
            >
              <Image
                src="/assets/appleIcon.png"
                alt="apple icon"
                width={20}
                height={20}
              />
              {!isMobile && <span>Continue with Apple</span>}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2  text-sm md:text-base mt-2 justify-center border border-[#F1F1F1] border-dashed py-4">
          <p className="text-[#828282] ">Don’t have an account?</p>
          <button
            className="hover:underline hover:bg-transparent px-0 bg-transparent text-primary font-semibold"
            onClick={() => router.push('/register-step-1')}
          >
            Sign up
          </button>
        </div>
      </Form>
    </div>
  );
};
export default LoginPage;
