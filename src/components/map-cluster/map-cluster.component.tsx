import React, { useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./map-cluster.component.scss";
import { GmapLatLng } from "../../models/gmap-location.model";
import { fetcherWithToken } from "../../utils/http";
import { RecordModel } from "../../models/record.model";
import * as classnames from "classnames";
import { cMapShort, symptomMap } from "../../enums/status.enum";

interface MapClusterProps {
  location: GmapLatLng & { coordinates?: number[] };
  records: RecordModel[];
  token: string;
}
const count = (arr, index, prop) =>
  arr.filter(record => record[prop] === index).length;
const Marker: any = ({ children, lat, lng }) => children;
const symptomClassMap = ["none", "mild", "moderate", "serious"];
const covClassMap = ["not-tested", "positive", "negative"];

export function MapCluster(props: MapClusterProps) {
  const mapRef: any = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const {
    location: { lat, lng, coordinates }
  } = props;
  const gLat = lat || (coordinates && coordinates[1]);
  const gLng = lng || (coordinates && coordinates[0]);
  const url = `/api/records?lat=${gLat}&lng=${gLng}`;
  const { data, error } = useSwr(url, { fetcher: fetcherWithToken });

  const records = data && !error ? data.slice(0, 2000) : [];

  const points = records.map(record => ({
    type: "Feature",
    properties: {
      cluster: false,
      recordId: record._id || record.id,
      status: record.status,
      cStatus: record.cStatus
    },
    geometry: {
      type: "Point",
      coordinates: record.location.coordinates
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,

    options: {
      radius: 50,
      maxZoom: 17
    }
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <div className="legend">
        <div>
          {symptomMap.map((status, index) => (
            <div key={index} className="legend__item legend__item--symptom">
              <div
                className={classnames("record-marker", symptomClassMap[index])}
              ></div>
              {status} ({count(records, index, "status")})
            </div>
          ))}
        </div>
        <div>
          {cMapShort.map((status, index) => (
            <div key={index} className="legend__item">
              <div
                className={classnames("record-marker", covClassMap[index])}
              ></div>
              {status} ({count(records, index, "cStatus")})
            </div>
          ))}
        </div>
      </div>

      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY as string }}
        defaultCenter={{ lat: gLat, lng: gLng } as any}
        defaultZoom={16}
        options={{ minZoom: 15 }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ] as any);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${20 + (pointCount / (points.length / 2)) * 20}px`,
                    height: `${20 + (pointCount / (points.length / 2)) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    if (mapRef && mapRef.current) {
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          const { recordId, cStatus, status } = cluster.properties;
          return (
            <Marker key={`record-${recordId}`} lat={latitude} lng={longitude}>
              <div
                className={classnames(
                  "record-marker",
                  symptomClassMap[status],
                  covClassMap[cStatus]
                )}
                style={{
                  width: `${25 + (pointCount / (points.length / 2)) * 20}px`,
                  height: `${25 + (pointCount / (points.length / 2)) * 20}px`
                }}
              ></div>
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
