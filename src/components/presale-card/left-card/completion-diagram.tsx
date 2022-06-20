import React, { useEffect } from 'react';
import GradientSVG from './circular-diagram';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { styled } from '@mui/system';
import { presaleData } from '../../../reducers/presale';
import { useAppSelector } from '../../../store';

// #d526fb
// #70EC9D
// #222231
// #3B3B58
// #1E1E2E

const S = {
  ShadowContainer: styled(CircularProgressbar)`
    -webkit-filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.2));
    filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.2));
  `,

  TextDescription: styled('div')`
    border-radius: 14px;
    background-color: rgba(0, 0, 0, 0.1);
    -webkit-backdrop-filter: blur(20px) grayscale(0.5);
    backdrop-filter: blur(20px) grayscale(0.5);
    p {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      padding: 1.5rem;
      font: 'InterSemiBold';
    }
  `,
};

export default function CompletionDiagram(): React.ReactElement {
  const savedPresaleData = useAppSelector(presaleData);
  const svgGradient = <GradientSVG startColor='#D922FD' endColor='#0CF4A8' idCSS='circularGradient' rotation={90} />;

  useEffect(() => {}, [savedPresaleData]);

  const totalRaised = savedPresaleData.totalRaised / 1000000;
  const hardcap = savedPresaleData.hardcap / 1000000;

  

  return (
    <div>
      <div className=''>
        {svgGradient}
        <S.ShadowContainer
          value={totalRaised / hardcap * 100}
          text={`$${totalRaised.toLocaleString()}`}
          className=' CircularProgressbar CircularProgressbar-path'
          strokeWidth={11}
          styles={buildStyles({
            strokeLinecap: 'round',
            textSize: '10px',
            pathTransitionDuration: 0.5,
            textColor: 'white',
            trailColor: '#28272C',
          })}></S.ShadowContainer>
      </div>
      <S.TextDescription className='relative bottom-20 z-10 flex justify-between items-center'>
        <p className='text-gray-300'>Hardcap</p>
        <p className='text-green-300'>$200,000</p>
        {/* <p className='text-green-300'>{`$${savedPresaleData.hardcap / 1000000}`}</p> */}
      </S.TextDescription>
    </div>
  );
}
