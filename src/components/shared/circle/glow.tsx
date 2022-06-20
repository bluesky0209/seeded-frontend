import { styled } from '@mui/system';

export interface StatusProps {
  status: string;
}

interface GlowCircleProps {
  color: string;
  className?: string;
  status?: string;
}

const S = {
  ShadowCircle: styled('div')<{ props: StatusProps }>`
    box-shadow: ${({ props }) =>
      props.status === '0'
        ? '0px 0px 9px rgba(245, 158, 11, 1)'
        : `${
            props.status === '1'
              ? '0px 0px 9px rgba(239, 68, 68,1)'
              : props.status === '2'
              ? '0px 0px 9px #00ffbb'
              : 'none'
          }`};
  `,
};

export default function GlowCircle({
  color,
  className = '',
  status = '0',
}: GlowCircleProps): JSX.Element {
  className = `rounded-full ${color} ${className}`;
  return <S.ShadowCircle props={{ status: status }} className={className} />;
}
