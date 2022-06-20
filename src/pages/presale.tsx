// import { ColorWave } from '../assets';
import { styled } from '@mui/system';
import { PaymentModal, PresaleCard } from '../components';
import background3 from '../assets/background3.svg';

const S = {
  MainContainer: styled('div')`
    background-image: url(${background3});
    background-size: 700px 1200px;
    background-repeat: no-repeat;
    background-position: center;
    background-position-y: -98px;
  `,
};

export default function Presale(): JSX.Element {
  return (
    <S.MainContainer className='flex-grow'>
      <div className='container m-auto  py-40'>
        <div className='z-10'>
          <PaymentModal />
          <PresaleCard />
        </div>
      </div>
    </S.MainContainer>
  );
}
