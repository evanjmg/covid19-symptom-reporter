import React, { useState } from "react";
import "./App.css";
import { Map } from "./components/map/map.component";
import { Form, FormState } from "./components/form/form.component";
import { SymptomStatus, COVStatus } from "./enums/status.enum";
import { FormStep } from "./enums/form-steps.enum";
import { MapCluster } from "./components/map-cluster/map-cluster.component";
import { GmapLatLng } from "./models/gmap-location.model";
import { fetcher } from "./utils/http";
import jwtdecode from "jwt-decode";
import { Spinner } from "@blueprintjs/core";

interface AppState {
  location: GmapLatLng | null;
  status: SymptomStatus | undefined;
  cStatus: COVStatus | undefined;
  hasSubmitted: boolean;
  captcha: string;
  token: string;
  step: FormStep;
}

function App() {
  const token = localStorage.getItem("_token");
  let data = {
    location: null,
    status: undefined,
    cStatus: undefined,
    hasSubmitted: false
  };
  if (token) {
    data = jwtdecode(token) as any;
  }
  const [state, setState] = useState({
    ...data,
    step: token ? FormStep.cluster : FormStep.form,
    token
  } as AppState);
  const [records, setRecords] = useState([]);
  const onFormUpdate = (state1: FormState): void => {
    setState({
      ...state,
      location: state1.location,
      status: state1.status,
      hasSubmitted: state1.hasSubmitted,
      captcha: state1.captcha,
      step:
        state1.hasSubmitted &&
        state1.location &&
        state1.status !== undefined &&
        state1.cStatus !== undefined &&
        !!state1.captcha
          ? FormStep.location
          : FormStep.form,
      cStatus: state1.cStatus
    });
  };

  const onConfirm = async (location: GmapLatLng): Promise<void> => {
    const url = `/api/records`;
    try {
      const data = await fetcher(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat]
          },
          captcha: state.captcha,
          status: state.status,
          cStatus: state.cStatus
        })
      });
      localStorage.setItem("_token", data.token);
      console.log(data);
      setState({
        ...state,
        location,
        step: FormStep.cluster,
        token: data.token
      });
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  switch (state.step) {
    case FormStep.form:
      return (
        <div className="FormContainer">
          <Form form={state} update={onFormUpdate} />
        </div>
      );
    case FormStep.location:
      return (
        <div className="App">
          <Map
            back={() =>
              setState({
                ...state,
                step: FormStep.form,
                captcha: "",
                hasSubmitted: false
              })
            }
            onConfirm={onConfirm}
            center={state.location as GmapLatLng}
          />
        </div>
      );
    default:
      return state.location ? (
        <MapCluster
          token={state.token}
          records={records}
          location={state.location as GmapLatLng}
        />
      ) : (
        <div>
          <Spinner></Spinner>
        </div>
      );
  }
}

export default App;
