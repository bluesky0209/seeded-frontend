import { ParentElementProps } from '.';

export default function BackdropBlurWrapper({ children }: ParentElementProps): React.ReactElement {
  return <div className={`backdrop-filter backdrop-blur-xl`}>{children}</div>;
}
