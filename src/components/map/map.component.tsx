import React, { Component, Fragment, MouseEvent } from "react";
import GoogleMapReact from "google-map-react";
import "./map.component.scss";
import { Button, Icon } from "@blueprintjs/core";
import { GmapLatLng } from "../../models/gmap-location.model";

interface MapState {
  selectedLocation: GmapLatLng;
}

interface MapProps {
  center: GmapLatLng;
  back: (event: MouseEvent<HTMLElement>) => void;
  zoom: number;
  onConfirm: (location: GmapLatLng) => void;
}

export class Map extends Component<MapProps, MapState> {
  static defaultProps = {
    center: null,
    zoom: 17
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedLocation: this.props.center
    };
  }
  confirm = () => {
    this.props.onConfirm(this.state.selectedLocation);
  };

  onDragEnd = map => {
    this.setState({
      selectedLocation: {
        lat: map.center.lat(),
        lng: map.center.lng()
      }
    });
  };

  render() {
    return (
      <div>
        {!!this.props.center && (
          <Fragment>
            <div
              style={{
                position: "relative",
                height: "calc(100vh - 100px)",
                width: "100%"
              }}
            >
              <Icon
                iconSize={60}
                className="marker"
                icon="map-marker"
                color="#137cbd"
              />
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_GOOGLE_KEY as string
                }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                onDragEnd={this.onDragEnd}
              ></GoogleMapReact>
            </div>
            <div className="bottomBar">
              <div>
                <Button
                  onClick={this.confirm}
                  intent="success"
                  large
                  text="Confirm location selection"
                />
                <Button onClick={this.props.back} large text="Go Back" />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
