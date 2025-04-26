'use client';

import { CustomFormField } from '@/components/common/CustomFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetCountries } from '@/hooks/location/useCountries';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
  registerStepTwoSchema,
  RegisterStepTwoSchemaType,
} from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import Calendar from 'react-calendar';
import { formatDate } from '@/utils/helper';
import { CiCalendarDate } from 'react-icons/ci';
import Link from 'next/link';

const RegisterStep2 = () => {
  const router = useRouter();

  const { isMobile } = useWindowSize();
  const [showCalendar, setShowCalendar] = useState(false);
  const [date_of_birth, setDateOfBirth] = useState<Date | null>(null);

  const handleDateChange = (
    value: Date | Date[] | [Date | null, Date | null] | null
  ) => {
    if (value instanceof Date) {
      setDateOfBirth(value);
      setShowCalendar(false);
    }
  };
  const { countries, isPending } = useGetCountries();

  const form = useForm<RegisterStepTwoSchemaType>({
    resolver: zodResolver(registerStepTwoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      country: '',
    },
    mode: 'onTouched',
  });

  const { control, formState } = form;
  const { errors } = formState;

  function onSubmit(values: RegisterStepTwoSchemaType) {
    console.log(values);
    router.push('/verify-email');
  }

  const handleCountryChange = (selectedOption: SingleValue | null) => {
    const countryValue = selectedOption?.value || '';
    form.setValue('country', countryValue, { shouldValidate: true });
  };

  const customStyles: StylesConfig<SingleValue, false> = useMemo(
    () => ({
      control: (provided) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f9f9f9f7',
        border: '1px solid #000',
        borderRadius: '8px',
        boxShadow: 'none',
        minHeight: '50px',
        padding: '0 12px',
        fontSize: '14px',
        color: '#1D2939',
        outline: 'none',
        '&:hover': {
          borderColor: '#692E9F',
        },
        '&:focus': {
          borderColor: 'transparent',
          outline: 'none',
        },
      }),
      placeholder: (provided) => ({
        ...provided,
        fontSize: '14px',
        color: '#b3b3b3',
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '10px',
        marginTop: '4px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#F0EAF5' : 'transparent',
        color: '#333333',
        fontSize: '16px',
        padding: '10px 8px',
        cursor: 'pointer',
        '&:active': {
          backgroundColor: '#EAEAEA',
        },
      }),
    }),
    []
  );

  return (
    <div>
      <span className="text-sm font-medium text-[#979797] grid place-items-center">
        Step 2 of 3
      </span>
      <div>
        <h2 className="text-primary text-lg md:text-2xl font-medium pt-8">
          Create an account
        </h2>
        <p>Join us now and start your job hunt journey with us.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" pt-8">
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <CustomFormField
                label="first name"
                name="firstName"
                control={control}
                placeholder="Enter first name"
                error={errors.firstName?.message}
              />
              <CustomFormField
                label="last name"
                name="lastName"
                control={control}
                placeholder="Enter last name"
                error={errors.firstName?.message}
              />
            </div>
            <div className="w-full ">
              <p className="font-semibold text-sm text-[#292D32] pb-2">
                Country
              </p>
              <Select
                instanceId="country-select"
                options={countries}
                isLoading={isPending}
                styles={customStyles}
                placeholder="Select Country"
                onChange={handleCountryChange}
                value={countries?.find(
                  (option) => option.value === form.watch('country')
                )}
              />
              {errors?.country?.message && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
            <div className="w-full box">
              <p className="font-semibold text-sm text-[#292D32] pb-2">
                Date of birth <span className="font-medium">(optional)</span>
              </p>
              <div className="w-full relative">
                <div
                  className={`flex gap-4 h-[48px] md:h-[56px] border  w-full rounded-[10px] cursor-pointer ${
                    date_of_birth
                      ? 'justify-between border-[#1A202C] bg-[#f9f9f9f7]'
                      : 'justify-end border-[#b8b8b8] bg-[#ffff] '
                  } items-center p-[10px]`}
                  onClick={() => setShowCalendar((prev) => !prev)}
                >
                  <p className="text-sm text-[#292D32]">
                    {date_of_birth ? formatDate(date_of_birth) : 'Pick date'}
                  </p>
                  <CiCalendarDate className="mr-2 h-4 w-4 text-primary" />
                </div>

                {showCalendar && (
                  <div className="absolute bottom-full mb-2 max-w-[350px] w-full z-30">
                    <Calendar
                      onChange={handleDateChange}
                      value={date_of_birth || new Date()}
                      maxDate={new Date()}
                      tileClassName={({ date }) =>
                        date.getDay() === 0 || date.getDay() === 6
                          ? 'weekend'
                          : ''
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className=" text-xs md:text-sm">
                By clicking Create account, I agree that the company may keep me
                informed with personalized emails about products and services
                and I have read and accepted the{' '}
                <Link href="/terms" className="underline font-bold">
                  terms of use
                </Link>{' '}
                and{' '}
                <Link href="/terms" className="underline font-bold">
                  privacy policy.
                </Link>
              </p>
            </div>
            <Button
              type="submit"
              className={`secondary-btn mt-6 mb-2 ${!isMobile && 'mb-4'}`}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default RegisterStep2;
