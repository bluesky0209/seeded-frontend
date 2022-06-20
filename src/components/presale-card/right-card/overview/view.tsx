import { formatEndDate } from './util';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { presaleData } from '../../../../reducers/presale';
import { useAppSelector } from '../../../../store';
import { getTimeLeft, normalize, Time } from '../timer/util';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import incubatorProjects from '../../../incubation-card/ido-projects.json';
export interface StepProps {
  label: React.ReactNode;
  blockStatus: number;
  description: React.ReactNode;
}

const S = {
  MuiStepper: styled(Stepper)`
    .MuiStepContent-root {
      height: 30px;
      padding-left: 20px;
      padding-right: 8px;
      border-left: 1px solid #bdbdbd;
      border: none;
    }
    .MuiStepConnector-root {
      margin-left: 21px;
    }
  `,
  MuiStep: styled(Step) <{ props: StepProps }>``,
  MuiStepLabel: styled('div')`
    .MuiSvgIcon-root {
      width: 42px;
      height: 42px;
      border: gold 5px solid;
      border-radius: 21px;
      text-align: left;
    }
    .MuiStepLabel-label {
      font: 'InterMedium';
      font-size: 16px;
    }
  `,
  MuiStepContent: styled(StepContent) <{ props: StepProps }>`
    border: none;
  `,
  DescriptionContainer: styled('div')`
    color: #31314d;
  `,
};

export default function VerticalLinearStepper() {
  const savedPresaleData = useAppSelector(presaleData);
  const [time, setTime] = useState<Time | undefined>(getTimeLeft());
  const [symbol, setSymbol] = useState<string>('XGLI');
  const [currentPresaleData, setCurrentPresaleData] = useState<any>([]);

  useEffect(() => {
    let str = window.location.pathname.substr(5);
    if (!str) str = 'XGLI';
    setSymbol(str);
    const getPresaleData = incubatorProjects.filter(function (item) {
      return item.symbol == symbol;
    });
    setCurrentPresaleData(getPresaleData);
  }, [window.location.pathname, symbol]);

  React.useEffect(() => {
    setTimeout(() => {
      setTime(getTimeLeft());
    }, 1000);
  }, [savedPresaleData]);

  const muiBlock = (props: StepProps): JSX.Element => {
    return (
      <S.MuiStep props={props} active key={props.blockStatus}>
        <S.MuiStepLabel>{props.label}</S.MuiStepLabel>
        <S.MuiStepContent props={props}>{props.description}</S.MuiStepContent>
      </S.MuiStep>
    );
  };

  const steps = [
    {
      label: (
        <div className="text-left ml-10 flex text-xl">
          <img
            src={'/images/' + currentPresaleData[0]?.logo}
            alt="solLogo"
            style={{
              width: '40px',
              marginRight: '15px',
              borderRadius: '50%',
              background: 'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
            }}
          />
          <div className="mt-1"> {currentPresaleData[0]?.name}</div>
        </div>
      ),
      blockStatus: 0,
      description: (
        <S.DescriptionContainer className="text-left text-white   pl-2">
          <p className="text-base text-gray-600 mt-4 font-sans">
            {currentPresaleData[0]?.description}
          </p>
          <p className="mt-4">
            <u className="text-green-500  ">
              <a
                href={currentPresaleData[0]?.links.twitter}
                target="_blank"
                className="no-underline"
              >
                <TwitterIcon />
              </a>
              <a
                href={currentPresaleData[0]?.links.telegram}
                target="_blank"
                className="no-underline	ml-2"
              >
                <TelegramIcon />
              </a>
              <a
                href={currentPresaleData[0]?.links.website}
                target="_blank"
                className="no-underline	ml-2"
              >
                <LanguageIcon />
              </a>
            </u>
          </p>
        </S.DescriptionContainer>
      ),
    },
    {
      label: (
        <div className="text-left ml-10 flex mt-6  text-green-400 text-xl	">
          IDO Informations
        </div>
      ),
      blockStatus: 1,
      description: (
        <S.DescriptionContainer className="text-left text-xs pl-2 mt-2">
          <p className="text-white text-base font-sans">
            Token Price:{' '}
            <span className="text-gray-600">{currentPresaleData[0]?.price}</span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Guaranteed Allocation Round:
            <span className="text-gray-600">
              {' '}
              {currentPresaleData[0]?.start_date},{' '}
              {currentPresaleData[0]?.start_time} -{' '}
              {/* {currentPresaleData[0]?.end_date}, */}
              {currentPresaleData[0]?.end_time}
            </span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            FCFS Round:
            <span className="text-gray-600 mt-1">
              {' '}
              {currentPresaleData[0]?.registration_start_date},{' '}
              {currentPresaleData[0]?.registration_start_time} -{' '}
              {/* {currentPresaleData[0]?.registration_end_date},{' '} */}
              {currentPresaleData[0]?.registration_end_time}
            </span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Listing details:
            <span className="text-gray-600 mt-1">
              <a href='https://support.bibox.jp/hc/en-us/articles/4713708330521'> Available here</a>
            </span>
          </p>
        </S.DescriptionContainer>
      ),
    },
    {
      label: (
        <div className="text-left ml-10 flex mt-6  text-green-400 text-xl	">
          Token
        </div>
      ),
      blockStatus: 2,
      description: (
        <S.DescriptionContainer className="text-left text-gray-600 text-xs pl-2 mt-2">
          <p className="text-white mt-1 text-base font-sans">
            Name:{' '}
            <span className="text-gray-600">
              {currentPresaleData[0]?.name}
            </span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Symbol:{' '}
            <span className="text-gray-600">
              {currentPresaleData[0]?.symbol}
            </span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Chain:{' '}
            <span className="text-gray-600">{currentPresaleData[0]?.chain}</span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Total supply:{' '}
            <span className="text-gray-600">
              {currentPresaleData[0]?.supply}
            </span>
          </p>
          <p className="text-white mt-1 text-base font-sans">
            Initial Marketcap:
            <span className="text-gray-600">
              {' '}
              {currentPresaleData[0]?.inital_market_cap}
            </span>
          </p>
        </S.DescriptionContainer>
      ),
    },
  ];
  if (!time) {
    steps[0].blockStatus = 0;
    steps[1].blockStatus = 0;
    steps[2].blockStatus = 0;
  } else if (savedPresaleData.isActive) {
    steps[0].blockStatus = 0;
    steps[1].blockStatus = 0;
    steps[2].blockStatus = 2;
  } else {
    steps[0].blockStatus = 0;
    steps[1].blockStatus = 1;
    steps[2].blockStatus = 2;
  }

  return (
    <Box sx={{ maxWidth: 400 }} className="mb-14">
      {steps.map((step) => muiBlock(step))}
    </Box>
  );
}
