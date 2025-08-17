import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FreeTrialButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const FreeTrialButton = ({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  children = 'Start Free Trial'
}: FreeTrialButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the auth page or scanner signup
    navigate('/auth');
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-gradient-to-r from-gluten-primary to-gluten-primary/80 hover:from-gluten-primary/90 hover:to-gluten-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </Button>
  );
};

export default FreeTrialButton;