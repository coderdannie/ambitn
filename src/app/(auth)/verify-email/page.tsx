'use client';

import { LoaderButton } from '@/components/common/LoaderButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import {
  useResendAccountCreationOtp,
  useResendPasswordOtp,
  useVerifyEmail,
  useVerifyPasswordOtp,
} from '@/service/query/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import RICIBs from 'react-individual-character-input-boxes';

interface RegisterResponse {
  message?: string;
}

const VerifyEmail = () => {
  const { addToast } = useToast();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const { isMobile } = useWindowSize();
  const router = useRouter();
  const type =
    typeof window !== 'undefined' ? sessionStorage.getItem('type') : null;

  const email =
    typeof window !== 'undefined' ? sessionStorage.getItem('email') : null;

  const { mutate, isPending } = useVerifyEmail({
    onSuccess: (res: RegisterResponse) => {
      addToast(res?.message || 'Email verified successfully!', 'success');
      router.push('/login');
      sessionStorage.removeItem('type');
      sessionStorage.removeItem('email');
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

  const { mutate: mutateResend, isPending: isResending } =
    useResendAccountCreationOtp({
      onSuccess: (res: RegisterResponse) => {
        addToast(res?.message || 'OTP resent successfully!', 'success');
        setTimeLeft(120); // Reset timer
      },
      onError: (error: {
        response?: { data?: { message?: string } };
        message?: string;
      }) => {
        addToast(
          error?.response?.data?.message ||
            error?.message ||
            'Failed to resend OTP',
          'error'
        );
      },
    });

  const { mutate: mutateVerifyPasswordOtp, isPending: isSendingOtp } =
    useVerifyPasswordOtp({
      onSuccess: (res: RegisterResponse) => {
        addToast(res?.message || 'OTP resent successfully!', 'success');
        router.push('/reset-password');
        sessionStorage.removeItem('type');
      },
      onError: (error: {
        response?: { data?: { message?: string } };
        message?: string;
      }) => {
        addToast(
          error?.response?.data?.message ||
            error?.message ||
            'Failed to send OTP',
          'error'
        );
      },
    });

  const { mutate: mutateOtpResend, isPending: isResendingOtp } =
    useResendPasswordOtp({
      onSuccess: (res: RegisterResponse) => {
        addToast(res?.message || 'OTP resent successfully!', 'success');

        setTimeLeft(120); // Reset timer
      },
      onError: (error: {
        response?: { data?: { message?: string } };
        message?: string;
      }) => {
        addToast(
          error?.response?.data?.message ||
            error?.message ||
            'Failed to resend OTP',
          'error'
        );
      },
    });

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = useCallback(
    (otpValue: string) => {
      if (!email) {
        addToast('Email not found. Please start over.', 'error');
        return;
      }

      if (!otpValue || otpValue.length !== 4) {
        addToast('Please enter a complete 4-digit OTP', 'error');
        return;
      }
      if (type === 'password') {
        mutateVerifyPasswordOtp({
          email: email,
          otp: otpValue,
        });
      } else {
        mutate({
          email: email,
          otp: otpValue,
        });
      }
    },
    [mutate, addToast, email]
  );

  const handleResendOtp = () => {
    if (timeLeft > 0 || isResending || isResendingOtp || !email) return;

    if (type === 'password') {
      mutateOtpResend({
        email: email,
      });
    } else {
      mutateResend({
        email: email,
      });
    }

    setOtp('');
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, [timeLeft]);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg mb-7">
      {!type?.includes('password') && (
        <span className="text-sm font-medium text-[#979797] grid place-items-center">
          Step 3 of 3
        </span>
      )}

      <div className="text-center">
        <h2 className="text-primary text-lg md:text-2xl font-medium pt-6 sm:pt-8">
          {type?.includes('password')
            ? 'Password Reset Code'
            : 'OTP Verification'}
        </h2>
        <p className="pt-2 sm:pt-3 text-gray-600 text-sm sm:text-base">
          Almost there! Please enter the One-Time Password (OTP) sent to{' '}
          <span className="font-medium">{email || 'your email'}</span>.
        </p>
      </div>

      <div className="grid place-items-center pt-6 sm:pt-10">
        <RICIBs
          amount={4}
          autoFocus
          handleOutputString={handleOtpChange}
          password
          inputProps={{
            style: {
              color: '#07142F',
              fontSize: 'clamp(24px, 8vw, 50px)',
              width: 'clamp(40px, 12vw, 70px)',
              height: 'clamp(40px, 12vw, 70px)',
              backgroundColor: '#EEF2F6',
              marginRight: 'clamp(8px, 3vw, 20px)',
              padding: '8px',
              border: '1px solid #00000040',
              borderRadius: '8px',
              textAlign: 'center',
            },
          }}
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <LoaderButton
          isLoading={isPending || isSendingOtp}
          disabled={otp.length !== 4 || isPending || isSendingOtp}
          isMobile={isMobile}
          className="w-full"
          onClick={() => handleSubmit(otp)}
          text={type?.includes('password') ? 'Continue' : 'Verify Email'}
        />
      </div>

      <div className="mt-4 sm:mt-6 text-center">
        {/* Loading state for resend operations */}
        {(isResending || isResendingOtp) && (
          <div className="flex items-center justify-center gap-2 text-blue-500 text-sm sm:text-base">
            <LoadingSpinner size="sm" />
            Resending OTP...
          </div>
        )}

        {/* Resend OTP section */}
        <p className="text-gray-600 text-sm sm:text-base">
          Didn`t receive the OTP?{' '}
          {timeLeft <= 0 ? (
            <button
              onClick={handleResendOtp}
              disabled={isResending || isResendingOtp}
              className={`text-blue-600 font-medium hover:text-blue-800 focus:outline-none ${
                isResending || isResendingOtp
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
              aria-busy={isResending || isResendingOtp}
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend in {formatTime()}</span>
          )}
        </p>
      </div>
      <p className="text-center pt-10 text-[#979797] text-sm md:text-base pb-4">
        Having difficulties with Code?{' '}
        <Link
          href="/contact-support"
          className="hover:underline text-black font-medium"
        >
          Get Help
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmail;
