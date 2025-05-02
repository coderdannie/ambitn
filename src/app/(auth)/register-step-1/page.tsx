'use client';

import { CustomFormField } from '@/components/common/CustomFormField';
import { LoaderButton } from '@/components/common/LoaderButton';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
  registerStepOneSchema,
  RegisterStepOneSchemaType,
} from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
  const router = useRouter();

  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterStepOneSchemaType>({
    resolver: zodResolver(registerStepOneSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const { control, formState } = form;
  const { errors } = formState;

  function onSubmit(values: RegisterStepOneSchemaType) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Store the complete registration data
      sessionStorage.setItem('registerDetails', JSON.stringify(values));

      router.push('/register-step-2');
    }, 2000);
  }

  return (
    <div>
      <span className="text-sm font-medium text-[#979797] grid place-items-center">
        Step 1 of 3
      </span>
      <div>
        <h2 className="text-primary text-lg md:text-2xl font-medium pt-8">
          Create an account
        </h2>
        <p>Join us now and start your job hunt journey with us.</p>
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

          {/* Submit Button */}
          <LoaderButton
            isLoading={isLoading}
            isMobile={isMobile}
            className="w-full"
          />
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
          <p className="text-[#828282] ">Already have an account?</p>
          <button
            className="hover:underline hover:bg-transparent px-0 bg-transparent text-primary font-semibold"
            onClick={() => router.push('/login')}
          >
            Sign In
          </button>
        </div>
      </Form>
    </div>
  );
};
export default RegisterPage;
