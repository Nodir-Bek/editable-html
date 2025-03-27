interface ButtonProps {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  };
  
   interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }