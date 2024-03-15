import React from "react";
import { useEffect , useState } from "react";
import { CssBaseline,Grid } from "@material-ui/core";

import { getPlacesData ,getWeatherData} from "./api";
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import PlaceDetails from './components/PlaceDetails/PlaceDetails';

const App =()=> {
    const [places,setPlaces]=useState([])

    const [weatherData, setWeatherData] = useState([]);
    const [coordinates , setCoordinates]=useState({});
    const [bounds,setBounds]=useState(null);

    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [type,setType]=useState('restaurants');
    const [rating,setRating]=useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        const filtered = places.filter((place) => Number(place.rating) > rating);
    
        setFilteredPlaces(filtered);
      }, [rating]);

    useEffect(()=> {
        navigator.geolocation.getCurrentPosition(({coords : { latitude , longitude }})=>{
            setCoordinates({lat:latitude,lng:longitude})
        });
    },[])

  

    useEffect(()=>{
        
        if (bounds && bounds.sw && bounds.ne) {
            setIsLoading(true);

            console.log(coordinates,bounds);
            console.log(weatherData);

            getWeatherData(coordinates.lat, coordinates.lng)
                   .then((data) => setWeatherData(data));
            
            getPlacesData(type,bounds.sw, bounds.ne)
                .then((data) => {
                    console.log(data);
                    setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    },[type,bounds]);


    const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  };

    return(
        <>
            <CssBaseline/>
            <Header
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
            />
            <Grid container spacing={3} style={{width:'100%'}}>
                <Grid item xs={12} md={4}> 
                    <List 
                    places={filteredPlaces.length ? filteredPlaces : places}
                    childClicked={childClicked}
                    isLoading={isLoading}
                    type={type}
                    setType={setType}
                    rating={rating}
                    setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>

        </>
    );
}

export default App;