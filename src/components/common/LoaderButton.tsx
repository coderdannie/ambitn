'use client';

import { Oval } from 'react-loader-spinner';
import { Button } from '@/components/ui/button';

interface LoaderButtonProps {
  isLoading: boolean;
  onClick?: () => void;
  isMobile?: boolean;
  className?: string;
  text?: string;
  disabled?: boolean;
}

export const LoaderButton = ({
  isLoading,
  onClick,
  isMobile = false,
  className = '',
  disabled,
  text = 'Submit',
}: LoaderButtonProps) => {
  return (
    <Button
      type="submit"
      className={`secondary-btn mt-6 ${!isMobile && 'mb-4'} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Oval
            height={20}
            width={20}
            color="#ffffff"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#ffffff"
            strokeWidth={6}
            strokeWidthSecondary={6}
          />
        </div>
      ) : (
        text
      )}
    </Button>
  );
};
