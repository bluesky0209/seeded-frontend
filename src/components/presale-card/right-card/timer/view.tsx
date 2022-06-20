import { useEffect, useState } from 'react';
import { presaleData } from '../../../../reducers/presale';
import { useAppSelector } from '../../../../store';
import { getTimeLeft, normalize, Time } from './util';

interface TimeAtomProps {
  time: number;
  tag: string;
}

function TimeAtom({ time, tag }: TimeAtomProps): React.ReactElement {
  return (
    <div className="col-span-2">
      <p className="text-4xl font-bold">{normalize(time)}</p>
      <p className="text-xs font-thin text-gray-500">{tag}</p>
    </div>
  );
}

function Divider(): React.ReactElement {
  return <p className="col-span-1  text-gray-500">:</p>;
}

export default function Timer(): React.ReactElement | null {
  const savedPresaleData = useAppSelector(presaleData);
  const [time, setTime] = useState<Time | undefined>(getTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTime(getTimeLeft());
    }, 1000);
  }, [savedPresaleData]);

  if (!time) {
    // sale ended
    return <h3 className="text-green-500">SALE ENDED</h3>;
  }

  // if (savedPresaleData.isActive) {
  //   return (
  //     <div>
  //       <h3 className="pb-2 text-xs font-thin text-gray-500">SALE END</h3>
  //       <div className="grid grid-cols-11 gap-0 justify-between">
  //         <TimeAtom time={time.days} tag="Days" />
  //         <Divider />
  //         <TimeAtom time={time.hours} tag="Hours" />
  //         <Divider />
  //         <TimeAtom time={time.minutes} tag="Minutes" />
  //         <Divider />
  //         <TimeAtom time={time.seconds} tag="Seconds" />
  //       </div>
  //     </div>
  //   );
  // }

  // SALE NOT STARTED
  return <h3 className="text-green-500"></h3>;
}
