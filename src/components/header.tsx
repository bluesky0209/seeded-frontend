import { styled } from '@mui/system';
import { Logo } from '../assets';
import { WalletConnect } from './wallet';
import Menu from './Menu';

interface ButtonProps {
  to: string;
  onClick?: any;
  children?: JSX.Element;
  className?: string;
}

interface CenterButtonProps {
  to: string;
  content: string;
}

const S = {
  HeaderWrapper: styled('nav')`
    border-bottom: solid #3b3b58 1px;
  `,
  MenuItem: styled(`div`)`
    @media (min-width: 720px) {
        display:none;
      }
  `
};

const Button = ({
  to,
  onClick,
  children,
  className,
}: ButtonProps): JSX.Element => (
  <button onClick={onClick ?? null} className={className ?? ''}>
    <a href={to}>{children}</a>
  </button>
);
const Button1 = ({
  to,
  onClick,
  children,
  className,
}: ButtonProps): JSX.Element => (
  <button onClick={onClick ?? null} className={className ?? ''}>
    <a href={to} target="_blank">{children}</a>
  </button>
);

function CenterButton({ to, content }: CenterButtonProps): JSX.Element {
  const pathName = window.location.pathname;
  return (
    <Button to={to}>
      <span
        className={`px-2 text-sm hover:text-green-400 transition duration-300 ${pathName === to ? 'text-green-400' : ''
          }`}
      >
        {content}
      </span>
    </Button>
  );
}
function LinkButton({ to, content }: CenterButtonProps): JSX.Element {
  const pathName = window.location.pathname;
  return (
    <Button1 to={to}>
      <span
        className={`px-2 text-sm hover:text-green-400 transition duration-300 ${pathName === to ? 'text-green-400' : ''
          }`}
      >
        {content}
      </span>
    </Button1>
  );
}

export default function Header(): JSX.Element {
  return (
    <S.HeaderWrapper className="bg-black">
      <div className="flex items-center justify-between h-16">
        <S.MenuItem>
          <Menu />
        </S.MenuItem>
        <Button to="https://seeded.network">
          <Logo />
        </Button>
        <div className="hidden md:flex items-center space-x-1 text-gray-400">
          {/* <CenterButton to='/nft' content='NFT' /> */}
          {/* <CenterButton to="/ido" content="PRESALE" /> */}
          <CenterButton to='https://seeded.network' content='ABOUT' />
          <CenterButton to="/projects" content="PROJECTS" />
          <CenterButton to='/nft' content='NFT' />

          {/* <CenterButton to="/lending" content="LENDING" /> */}
          <CenterButton to="/staking" content="STAKING" />

          <CenterButton to='https://docs.google.com/forms/u/5/d/e/1FAIpQLSemnN7kqHFyM3ENrrXlJi_P7sCd0W4e-AnwCOPrjsp7XyA4YA/viewform' content='APPLY' />
          <CenterButton to='https://seeded.network/whitepaper' content='DOCS' />
          <CenterButton to='https://linktr.ee/seedednetwork' content='SOCIALS' />
          <LinkButton to='https://jup.ag/swap/USDC-SEEDED' content='BUY' />
        </div>
        <div className="px-5 y-3.5">
          <WalletConnect />
        </div>
      </div>
    </S.HeaderWrapper>
  );
}

//<ThemedFadeButton content='[Wallet Placeholder]' className='x-2' />
