import { styled } from '@mui/system';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const S = {
  WallertBtn: styled(WalletMultiButton)`
    color: black;
    background-image: linear-gradient(to right, #7b54ff, #70ec9d) !important;
    height: 40px;

    .wallet-adapter-button-start-icon {
      display: none;
    }
  `,
};

export default function WalletConnect(): JSX.Element {
  return <S.WallertBtn />;
}
