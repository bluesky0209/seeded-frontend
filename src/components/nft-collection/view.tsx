import { Grid, Typography, TextField } from '@mui/material';
import React, { useState } from 'react';
import collection_data from './devnet_temp.json'
import axios from "axios";

interface CollectionState {
  name: string;
  image: string;
  attributes: [];
}

export default function View(): JSX.Element {

  const [state, setState] = useState({
    mobileView: false,
  });

  const [collectionIds, setCollectionIds] = useState<any | null>(null);
  const [orjCollection, setOrjCollection] = useState<any | null>(null);
  const [collection, setCollection] = useState<any | null>(null);
  const [searchCollection, setSearchCollection] = useState<any | null>(null);
  const [jsonCollection, setJsonCollection] = useState<any | null>(null);
  const [searchState, setSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  React.useEffect(() => {
    getJsonCollection()
    getCollection()
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const { mobileView } = state;

  function getData(url) {
    return new Promise((resolve, reject) => {
      axios
          .get(url)
          .then(response => {
            resolve(response.data)
          })
          .catch(err => reject(err))
    })
  }

  async function getJsonCollection() {
    let arr: CollectionState[] = []
    for (var pro in collection_data.items) {
      let res: any = {
        name: collection_data.items[pro].name.toString().split("#")[1],
        image: collection_data.items[pro].link,
        attributes: []
      }
      arr.push(res)
    }
    setJsonCollection([...arr])
  }

  async function getCollection() {
    let arr: CollectionState[] = []
    let arr_number: String[] = []
    let count = 0
    for (var pro in collection_data.items) {
      let res: any = {
        name: "",
        image: "",
        attributes: []
      }
      res = await getData(collection_data.items[pro].link)
      if (res && res.name) {
        const data: CollectionState = {
          name: res.name,
          image: res.image,
          attributes: res.attributes
        }
        arr.push(data)
        arr_number.push(res.name.toString().split("#")[1])
      }
      count += 1
      if (count == 9) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 20) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 30) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 50) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 80) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 100) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 150) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 200) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 300) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 500) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 1000) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 2000) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      } else if (count === 5000) {
        setOrjCollection([...arr])
        setCollection([...arr])
        setCollectionIds([...arr_number])
      }
    }
    setOrjCollection([...arr])
    if (!searchState) {
      setCollection([...arr])
    }
    setCollectionIds([...arr_number])
  }

  function showCollection() {
    return collection.map((data, index) => {
      return (
        <Grid item xs={mobileView ? 12 : 4} key={index}>
          <Grid display="flex" container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h3" component="div" className="mint-text1" style={{marginBottom: 20}}>
                {data.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid display="flex" container alignItems="center" justifyContent="center" style={{backgroundColor: '#101021',borderColor: '#0CF3A8', borderWidth: 1, borderRadius: 10, padding: 30, paddingTop: 40, marginBottom: 20, paddingBottom: 40}}>
                <Grid item xs={12}>
                  <img src={data.image} style={{objectFit: 'contain', borderRadius: 10,}} />
                </Grid>
              </Grid>
              <Grid display="flex" container alignItems="center" justifyContent="center">
                {data.attributes && data.attributes !== null && data.attributes.length > 0 && (
                  data.attributes.map((att, ind) => 
                    <Grid item xs={5} key={ind} style={{backgroundColor: '#000013', padding: 5, borderRadius: 10, margin: 5}}>
                      <Typography component="div" className="collection-text4" style={{marginBottom: 10, marginTop: 10}}>
                        {att.trait_type}
                      </Typography>
                      <Typography variant="h3" component="div" className="collection-text3" style={{marginBottom: 10}}>
                        {att.value}
                      </Typography>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )

    })
  }

  function showCollection2() {
    return searchCollection.map((data, index) => {
      return (
        <Grid item xs={mobileView ? 12 : 4} key={index}>
          <Grid display="flex" container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h3" component="div" className="mint-text1" style={{marginBottom: 20}}>
                {data.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid display="flex" container alignItems="center" justifyContent="center" style={{backgroundColor: '#101021',borderColor: '#0CF3A8', borderWidth: 1, borderRadius: 10, padding: 30, paddingTop: 40, marginBottom: 20, paddingBottom: 40}}>
                <Grid item xs={12}>
                  <img src={data.image} style={{objectFit: 'contain', borderRadius: 10,}} />
                </Grid>
              </Grid>
              <Grid display="flex" container alignItems="center" justifyContent="center">
                {data.attributes && data.attributes !== null && data.attributes.length > 0 && (
                  data.attributes.map((att, ind) => 
                    <Grid item xs={5} key={ind} style={{backgroundColor: '#000013', padding: 5, borderRadius: 10, margin: 5}}>
                      <Typography component="div" className="collection-text4" style={{marginBottom: 10, marginTop: 10}}>
                        {att.trait_type}
                      </Typography>
                      <Typography variant="h3" component="div" className="collection-text3" style={{marginBottom: 10}}>
                        {att.value}
                      </Typography>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )

    })
  }

  async function onChange2(e) {
    if (collectionIds && collectionIds !== null && collectionIds.length > 0) {
      let arr: CollectionState[] = []
      for (let i = 0; i < collectionIds.length; i++) {
        if (collectionIds[i].includes(e.target.value)) {
          arr.push(orjCollection[i])
        }
      }
      setCollection(arr)
    }
  }

  let test = ""
  async function onChange(e) {
    test = e.target.value
    setSearchValue(e.target.value)
    if (e.target.value === null || e.target.value === undefined || e.target.value === "") {
      setCollection(orjCollection)
      setSearch(false)
    } else {
      setSearch(true)
    }
    if (jsonCollection && jsonCollection !== null && jsonCollection.length > 0) {
      let arr: CollectionState[] = []
      for (let i = 0; i < jsonCollection.length; i++) {
        if (jsonCollection[i].name.includes(e.target.value)) {
          if (orjCollection[i]) {
            arr.push(orjCollection[i]) 
          } else {
            let res: any = {
              name: "",
              image: "",
              attributes: []
            }
            res = await getData(jsonCollection[i].image)
            if (res && res.name) {
              const data: CollectionState = {
                name: res.name,
                image: res.image,
                attributes: res.attributes
              }
              arr.push(data)
            }
          }
          if (test !== e.target.value || e.target.value === "" || e.target.value === null || e.target.value === undefined) {
            break;
          }
          setSearchCollection(arr)
        }
        if (test !== e.target.value || e.target.value === "" || e.target.value === null || e.target.value === undefined) {
          break;
        }
      }
    }
  }

  return (
    <div className='dashboard-layout'>
      <main className=''>
        <Grid display="flex" container alignItems="center" justifyContent="center">
          <Grid item xs={mobileView ? 12 : 8}>
            <Grid display="flex" container alignItems="flex-end" spacing={5} justifyContent="flex-end" style={{paddingTop: 0, marginTop: '4%'}}>
              <Grid item>
                <TextField className="collection-text2" id="outlined-basic" label="Search your NFT" onChange={onChange} variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={mobileView ? 12 : 8}>
            <Grid display="flex" container alignItems="center" spacing={5} justifyContent="center" style={{paddingTop: 0, paddingBottom: 30, marginTop: '4%', marginBottom: '20%'}}>
              {!searchState && collection && collection !== null && collection.length > 0 && (
                showCollection()
              )}
              {searchState && searchCollection && searchCollection !== null && searchCollection.length > 0 && (
                showCollection2()
              )}
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
