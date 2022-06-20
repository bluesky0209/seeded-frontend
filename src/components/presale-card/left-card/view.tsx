import { WalletStatus } from '.';
import { useState, useEffect } from 'react';
import CompletionDiagram from './completion-diagram';
import Footer from './footer';
import incubatorProjects from '../../incubation-card/ido-projects.json';
export default function View(): JSX.Element {
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

  return (
    <div>
      <header className="text-left">
        <h3 className="text-xl text-gray-500">Overview</h3>
        <h1 className="text-4xl font-bold">{currentPresaleData[0]?.name}</h1>
      </header>
      <div className="pt-12 pb-10">
        <CompletionDiagram />
      </div>
      <Footer walletStatus={WalletStatus.Connected} />
    </div>
  );
}
