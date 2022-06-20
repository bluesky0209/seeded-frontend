import { styled } from '@mui/system';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { Route, Link } from 'react-router-dom';
import { useNotify } from '../payment-modal/sub-components';
import incubationCardBk from '../../assets/incubationCardBk.svg';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LanguageIcon from '@mui/icons-material/Language';
import FilterListIcon from '@mui/icons-material/FilterList';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@mui/styles';
import incubatorProjects from './incubator-projects.json';
import idoProjects from './ido-projects.json';
import CountDown from './count-down.js'

const S = {
  Nav: styled('div')`
    height: 100px;
    width: 45%;
    margin: auto;
    margin-top: 100px;
  `,
  Filter: styled('div')`
    float: left;
  `,
  Search: styled('div')`
    float: right;
    background-image: linear-gradient(
      to bottom right,
      #222231b2,
      #000013b2
    ) !important;
    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);
  `,
  CardBanner: styled('div')`
    // background-image: url(${incubationCardBk});
    height: 190px;
    padding: 10px;
    background-size: cover;
  `,
  CardStatus: styled('div')`
    background: #ecbc70;
    width: 80px;
    height: 30px;
    color: black;
    border-radius: 10px;
    border-radius: 7px;
    font-size: 13px;
    padding: 6px 10px 6px 10px;
  `,
  BlurContainer: styled('div')`
    overflow: hidden;
    border-radius: 1rem;
    border: #3b3b58 solid 1px;
    background-image: linear-gradient(
      to bottom right,
      #222231b2,
      #000013b2
    ) !important;
    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);
    font-family: sans-serif !important;
    @media (max-width: 720px) {
      margin:10px;
    }
  `,
  cardBk: styled('div')`
    background-image: url('');
  `,
  CardContext: styled('div')`
    padding: 0px 30px 30px 30px;
  `,
  Title: styled('div')`
    color: white;
    font-size: 26px;
    height: 100px;
    width: 100%;
    margin: auto;
    margin-top:50px;
    margin-bottom: -30px;
    text-align: center;
    
    @media (max-width: 720px) {
      font-size: 21px;
    }
  `,
  Card: styled('div')`
    @media (max-width: 720px) {
      width:288px;
      display:inline;
    }
  `,
  Links: styled('div')`
    color: #10f5b4;
    position: absolute;
    text-align: left;
    margin-top: 15px;
  `,
  StartDateLabel: styled('div')`
    float: left;
    color: #565670;
    font-family: sans-serif;
    font-size: 14px;
  `,
  StartDate: styled('div')`
    float: right;
    font-size: 16px;
    font-family: sans-serif;
  `,
  RaiseAmountLabel: styled('div')`
    float: left;
    color: #565670;
    font-family: sans-serif;
    font-size: 14px;
  `,
  RaiseAmount: styled('div')`
    float: right;
    font-size: 16px;
    font-family: sans-serif;
  `,
};

export default function View() {
  const [idoUpcoming, setIdoUpcoming] = useState([]);
  const [idoComplete, setIdoComplete] = useState([]);
  const [idoLive, setIdoLive] = useState([]);

  const [incUpcoming, setIncUpcoming] = useState([]);
  const [incComplete, setIncComplete] = useState([]);
  const [incLive, setIncLive] = useState([]);

  useEffect(() => {
    if (idoProjects.length > 0) {
      const result1 = idoProjects.filter(item => item.label === 'Upcoming');
      const result2 = idoProjects.filter(item => item.label === 'Live');
      const result3 = idoProjects.filter(item => item.label === 'Complete');
      setIdoUpcoming(result1);
      setIdoLive(result2);
      setIdoComplete(result3);
    }
    if (incubatorProjects.length > 0) {
      const result1 = incubatorProjects.filter(item => item.label === 'Upcoming');
      const result2 = incubatorProjects.filter(item => item.label === 'Live');
      const result3 = incubatorProjects.filter(item => item.label === 'Complete');
      setIncUpcoming(result1);
      setIncLive(result2);
      setIncComplete(result3);
    }
  }, [idoProjects, incubatorProjects])

  const useStyles = makeStyles({
    icon: {
      fill: 'white',
    },
    root: {
      color: 'white',
    },
  });
  const classes = useStyles();
  return (
    <>
      {
        idoUpcoming.length > 0 ?
          <>
            <S.Title>Upcoming IDOs</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {idoUpcoming?.map((item, index) => (
                <Link to={''} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>STARTS IN</S.RaiseAmountLabel>

                        <S.RaiseAmount> <CountDown startDate={item.start_date_format} startTime={item.start_time_format} /></S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
      {
        idoComplete.length > 0 ?
          <>
            <S.Title>Completed IDOs</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {idoComplete?.map((item, index) => (
                <Link to={''} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>COMPLETED ON</S.RaiseAmountLabel>
                        <S.RaiseAmount> {item.end_date}</S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
      {
        idoLive.length > 0 ?
          <>
            <S.Title>Live IDOs</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {idoLive?.map((item, index) => (
                <Link to={'/ido/' + item.symbol} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
      {
        incUpcoming.length > 0 ?
          <>
            <S.Title>Upcoming Incubations</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {incUpcoming?.map((item, index) => (
                <Link to={''} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>STARTS IN</S.RaiseAmountLabel>

                        <S.RaiseAmount> <CountDown startDate={item.start_date_format} startTime={item.start_time_format} /></S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
      {
        incComplete.length > 0 ?
          <>
            <S.Title>Completed Incubations</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {incComplete?.map((item, index) => (
                <Link to={''} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>COMPLETED ON</S.RaiseAmountLabel>
                        <S.RaiseAmount> {item.end_date}</S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
      {
        incLive.length > 0 ?
          <>
            <S.Title>Live Incubations</S.Title>
            <S.Card
              className="flex justify-center items-start m-auto grid grid-cols-2 gap-8"
              style={{ width: '45%' }}
            >
              {incLive?.map((item, index) => (
                <Link to={'/ido/' + item.symbol} key={index}>
                  <S.BlurContainer>
                    <S.CardBanner
                      style={{
                        backgroundImage: `url(${item.banner
                          })`,
                      }}
                    >
                      {item.label === 'Complete' ? (
                        <S.CardStatus style={{ backgroundColor: '#6edfb1' }}>
                          {item.label}
                        </S.CardStatus>
                      ) : (
                        <S.CardStatus>{item.label}</S.CardStatus>
                      )}
                    </S.CardBanner>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '-50px auto 0',
                      }}
                    >
                      <img
                        src={'images/' + item.logo}
                        alt="solLogo"
                        style={{
                          borderRadius: '50%',
                          width: '88px',
                          border: 'solid 1px white',
                          background:
                            'linear-gradient(70deg, #171720 30%, #ffffff 90%)',
                        }}
                      />
                    </div>
                    <S.CardContext>
                      <div style={{ height: '20px' }}>
                        <div style={{ float: 'left', fontSize: '20px' }}>
                          {item.name}
                        </div>
                        <div style={{ float: 'right' }}>
                          <div style={{ display: 'flex' }}>
                            <img
                              src={'images/' + item.symbolLogo}
                              alt="solLogo"
                              style={{
                                width: '24px',
                                marginRight: '5px',
                              }}
                            />
                            <p style={{ fontSize: '16px' }}>{item.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <S.Links>
                        <a
                          href={item.links && item.links.twitter ? item.links.twitter : ''}
                          target="_blank"
                          className="no-underline"
                        >
                          <TwitterIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <TelegramIcon />
                        </a>
                        <a href="#" target="_blank" className="no-underline	ml-2">
                          <LanguageIcon />
                        </a>
                      </S.Links>
                      <div style={{ height: '40px', marginTop: '70px' }}>
                        <S.StartDateLabel>STARTING DATE</S.StartDateLabel>
                        <S.StartDate>
                          {item.start_date} {item.start_time}
                        </S.StartDate>
                      </div>
                      <div style={{ height: '40px' }}>
                        <S.RaiseAmountLabel>RAISE AMOUNT</S.RaiseAmountLabel>
                        <S.RaiseAmount>{item.total_raise}</S.RaiseAmount>
                      </div>
                    </S.CardContext>
                  </S.BlurContainer>
                </Link>
              ))}
            </S.Card>
          </>
          : ''
      }
    </>
  );
}
