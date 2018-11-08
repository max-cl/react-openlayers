import React, { Component, Fragment } from 'react';
import MapComponent from './MapComponent';

class Container extends Component {
    constructor(props){
        super(props);
        this.state = {
            coordinates: {
                longitude: null,
                latitude: null
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }    

    handleSubmit = (e) => {
        e.preventDefault();
        const longitude = e.target.long.value;
        const latitude = e.target.lat.value;
        const coordinates = { 
            longitude: parseFloat(longitude,10), 
            latitude: parseFloat(latitude,10)
        };
        this.setState({ coordinates: coordinates });
    }

    render() {
        
        const { coordinates } = this.state;

        return (
            <Fragment>
                <h3>React + Openlayers</h3>
                <h5>Try the next coordinate</h5>
                <span>LONGITUDE: 11.5753822, LATITUDE: 48.1371079</span>
                {/* <ul style={{ listStyle: 'none', fontSize: 14 }}>
                    <li>LONGITUDE: 11.5753822</li>
                    <li>LATITUDE: 48.1371079</li>
                </ul> */}
          
                <form onSubmit={this.handleSubmit}>
                    <input type="text" id="long" placeholder="Longitude" />
                    <input type="text" id="lat" placeholder="Latitude" />
                    <button type="submit">Search</button>
                </form>
                <MapComponent coordinates={coordinates} />
            </Fragment>
        );
    }
}

export default Container;
