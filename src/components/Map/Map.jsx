import React from "react";
import { useState } from "react";
import GoogleMapReact from "google-map-react";
import { Paper,Typography,useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined"
import { Rating } from "@material-ui/lab";
import mapStyles from './mapStyles';

import useStyles from "./styles";

 const Map = ({setCoordinates,setBounds,coordinates,places,setChildClicked,weatherData})=> {
   const classes = useStyles();
   const matches = useMediaQuery('(min-width:600px');
   
   console.log(weatherData);
   console.log(places.list);

   const weatherIcon = weatherData?.weather?.[0]?.icon;

    return(
        <div className={classes.mapContainer}>
            <GoogleMapReact 
                bootstrapURLKeys={{key : process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50,50,50,50]}
                options={{disableDefaultUI: true, zoomControl: true ,styles: mapStyles}}
                onChange={(e)=> {
                        setCoordinates({lat: e.center.lat,lng: e.center.lng});
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                }}
                onChildClick={(child) => setChildClicked(child)}
            >
            {places.length && places.map((place, i) => (
                <div
            className={classes.markerContainer}lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
            >
            {!matches
              ? <LocationOnOutlinedIcon color="primary" fontSize="large" />
              : (
                <Paper elevation={3} className={classes.paper}>
                  <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
                  <img
                    className={classes.pointer}
                    src={place.photo ? place.photo.images.large.url : 'https://assets.cntraveller.in/photos/651e65983734f323ef3d37fe/16:9/w_960,c_limit/SWING-9.jpg'}
                  />
                  <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
                </Paper>
              )}
          </div>
        ))}
          
          {weatherIcon && (
          <div lat={coordinates.lat} lng={coordinates.lng}>
            <img src={`http://openweathermap.org/img/wn/${weatherIcon}.png`} height="70px" />
          </div>
        )}
            </GoogleMapReact>
        </div>
        );
 }

 export default Map;