'use client';

import { useState, useEffect, useCallback } from 'react';
import RICIBs from 'react-individual-character-input-boxes';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 4) {
      handleSubmit(value);
    }
  };

  const handleSubmit = (otpValue: string) => {
    setIsSubmitting(true);
    console.log('Submitting OTP:', otpValue);
    // API call to verify OTP would go here
  };

  const handleResendOtp = () => {
    setTimeLeft(120);
    setCanResend(false);
    setOtp('');
    console.log('Resending OTP...');
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

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
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <span className="text-sm font-medium text-[#979797] grid place-items-center">
        Step 3 of 3
      </span>
      <div className="text-center">
        <h2 className="text-primary text-lg md:text-2xl font-medium pt-6 sm:pt-8">
          OTP Verification
        </h2>
        <p className="pt-2 sm:pt-3 text-gray-600 text-sm sm:text-base">
          Almost there! Please enter the One-Time Password (OTP) sent to your
          registered email below.
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
      <div className="mt-4 sm:mt-6 text-center">
        {isSubmitting && (
          <p className="text-blue-500 text-sm sm:text-base">Verifying OTP...</p>
        )}
        <p className="text-gray-600 text-sm sm:text-base">
          Didn`t receive the OTP?{' '}
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-blue-600 font-medium hover:text-blue-800 focus:outline-none"
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend in {formatTime()}</span>
          )}
        </p>
      </div>
      <div className="mt-6 sm:mt-8">
        <button
          onClick={() => handleSubmit(otp)}
          disabled={otp.length !== 4 || isSubmitting}
          className={`w-full secondary-btn ${
            otp.length !== 4 || isSubmitting ? ' cursor-not-allowed' : ''
          }`}
        >
          Verify Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
