import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  Presale,
  NotFound,
  UnderConstruction,
  Lending,
  Staking,
  NftStaking,
  Incubation,
} from "./pages";
import { PageWrapper } from "./wrappers";
import NFT from "./pages/nft";
import NFTCollection from "./pages/nft_collection";

export default function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Switch>
          <Route exact path="/" key="HOME" component={Incubation} />
          {/* <Route exact path='/nft' key='NFT' component={NFT} /> */}
          <Route path="/ido" key="IDO" component={Presale} />
          <Route
            exact
            path="/nft"
            key="COLLECTION"
            component={NFTCollection}
          />

          {/* <Route exact path="/lending" key="LENDING" component={Lending} /> */}
          <Route exact path="/staking" key="STAKING" component={Staking} />
          <Route exact path='/nft_staking' key='NFTSTAKING' component={NftStaking} />
          <Route
            exact
            path="/projects"
            key="INCUBATION"
            component={Incubation}
          />
          <Route path="*" key="NOT_FOUND" component={Incubation} />
        </Switch>
      </PageWrapper>
    </BrowserRouter>
  );
}
