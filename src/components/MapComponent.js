import React, { Component } from 'react';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Circle } from 'ol/geom';
import { Style, Fill, Stroke } from 'ol/style';
import {  defaults as defaultControls, ZoomSlider, FullScreen } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import { transform } from 'ol/proj';

class MapComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            centerLong: 11.576124,
            centerLat: 48.137154,
            centerPoint: [],
            zoom:8,
            maxZoom: 20,
            minZoom: 2,
            radius: 20,
            initialMap: {}
        }
        this.createMap = this.createMap.bind(this);
        this.createCenterPoint = this.createCenterPoint.bind(this);
        this.createCircleLayer = this.createCircleLayer.bind(this);
        this.pushLayer = this.pushLayer.bind(this);
        this.paintLayer = this.paintLayer.bind(this);
        this.centerAddress = this.centerAddress.bind(this);
        this.removeOldAddress = this.removeOldAddress.bind(this);
    }

    shouldComponentUpdate() {
        return true;
    }

    // // componentWillReceiveProps(nextProps){
        
    // // }

    componentWillMount() {
        this.createCenterPoint();
    }

    componentDidMount() {
        this.createMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.coordinates !== prevProps.coordinates) {
            this.createCircleLayer(this.props.coordinates);
        }
    }

    createCenterPoint = () => {
        const centerPoint = transform([this.state.centerLong, this.state.centerLat], 'EPSG:4326','EPSG:3857');
        this.setState({
            centerPoint: centerPoint
        });
    }

    createMap = () => {
        const view = new View({
            center: this.state.centerPoint,
            zoom: this.state.zoom,
            maxZoom: this.state.maxZoom,
            minZoom: this.state.minZoom
        });

        const baseLayer = new TileLayer({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new OSM()
        });

        const map = new Map({
            target: this.refs.mapContainer,
            controls: defaultControls().extend([
                new ZoomSlider(),
                new FullScreen()
            ]), 
            attributionOptions: {
                collapsible: false
            },
            interactions: defaultInteractions({
                mouseWheelZoom: true
            }),
            renderer: 'canvas',
            layers: [baseLayer],
            view: view
        });

        this.setState({ initialMap: { map: map } });
    };

    //Create a new circle layer (vectorlayer)
    createCircleLayer = (coord) => {
        const center = transform([coord.longitude,coord.latitude], 'EPSG:4326', 'EPSG:3857'); 
        const circle = new Circle(
            center,
            this.state.radius
        );
        
        const circleFeature = new Feature(circle);  
        const vectorSource = new VectorSource({
            projection: 'EPSG:4326',
            features: [circleFeature]
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource
        });
        this.removeOldAddress();
        this.pushLayer(vectorLayer);  
        this.centerAddress(center);
    }

    //Add new Layer to the map
    pushLayer = (layer) => {       
        const painted = this.paintLayer('rgba(180, 0, 0, 0.7)', 'rgba(180, 0, 0, 1)', 3);
        layer.setStyle(painted);         
        this.state.initialMap.map.addLayer(layer);
    }

    //Paint the address founded
    paintLayer = (fillColor, strokeColor, widthStroke) => {
        const StyleAddress = new Style({
            fill: new Fill({
                color: fillColor
            }),
            stroke: new Stroke({
                color: strokeColor,
                width: widthStroke
            })
        });
        return StyleAddress;
    };

    // Center the address founded
    centerAddress = (coord) => {
        const map = this.state.initialMap.map;
        const view =  map.getView();
        view.setCenter(coord);
        view.setZoom(17);
    };

    //Remove old layers (Address)  
    removeOldAddress = () => {   
        const map = this.state.initialMap.map;

        //FIX: change to a object {} and manage with map.layersToRemove
        let layersToRemove = [];
        map.getLayers().forEach(function (layer) {
            layersToRemove.push(layer);        
        });
    
        const len = layersToRemove.length;
        let i = 0;
        if(len > 1){
            for(i = 1; i < len; i++) { 
                map.removeLayer(layersToRemove[i]);
            }
        }else {
            return false;
        }
    }


    render() {
        return (
            <div id="mapContainer" ref="mapContainer"> </div>
        );
    }
}

export default MapComponent;