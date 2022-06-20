import { ParentElementProps } from '..';

export default function Header({ children }: ParentElementProps) {
  return <div className="pr-8 text-md font-thin text-white">{children}</div>;
}
