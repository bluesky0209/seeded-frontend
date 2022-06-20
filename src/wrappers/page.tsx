import { styled } from '@mui/system';
import background3 from '../assets/background3.svg';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps): React.ReactElement {
  return <div className='flex-grow'>{children}</div>;
}
