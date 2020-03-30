import React, { Fragment, PureComponent } from "react";
import {
  SymptomStatus,
  symptomMap,
  cMap,
  COVStatus
} from "../../enums/status.enum";
import { Radio, RadioGroup, Button } from "@blueprintjs/core";
import ReCAPTCHA from "react-google-recaptcha";
import "./form.component.scss";
import { LocationSearchInput } from "../autocomplete/autocomplete.component";
export interface FormState {
  status: SymptomStatus | undefined;
  cStatus: COVStatus | undefined;
  location: any;
  captcha: string;
  hasSubmitted: boolean;
}

interface FormProps {
  form: FormState;
  update: (state: FormState) => void;
}

export class Form extends PureComponent<FormProps> {
  defaultProps = {
    status: undefined,
    cStatus: undefined,
    location: null,
    hasSubmitted: false
  };

  onChange = evt =>
    this.props.update({
      ...this.props.form,
      status: parseInt(evt.target.value, 10)
    });
  onChangeC = evt =>
    this.props.update({
      ...this.props.form,
      cStatus: parseInt(evt.target.value, 10)
    });

  onAddressChange = location => {
    this.props.update({ ...this.props.form, location });
  };
  onChangeCaptcha = captcha => {
    this.props.update({ ...this.props.form, captcha });
  };
  get isValid(): boolean {
    return (
      this.props.form.location &&
      this.props.form.cStatus !== undefined &&
      this.props.form.status !== undefined &&
      !!this.props.form.captcha
    );
  }
  submit = () => {
    this.props.update({
      ...this.props.form,
      hasSubmitted: true,
      cStatus: this.props.form.cStatus,
      status: this.props.form.status
    });
  };

  renderBody(): JSX.Element {
    return (
      <div className="form">
        <h1>COVID-19 Reporter</h1>
        <h2>Anonymously Report your Status to see your neighborhood</h2>
        Report your symptoms to see who else around you has symptoms. Learn more
        about symptoms{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.who.int/health-topics/coronavirus#tab=tab_3"
        >
          on the WHO site
        </a>
        .
        <RadioGroup
          label="How are you feeling now?"
          name="group"
          onChange={this.onChange}
          selectedValue={String(this.props.form.status)}
        >
          {symptomMap.map((symptom, index) => {
            return (
              <Radio key={index} label={symptom} value={String(index)}></Radio>
            );
          })}
        </RadioGroup>
        <RadioGroup
          label="What is your status?"
          name="group2"
          onChange={this.onChangeC}
          selectedValue={String(this.props.form.cStatus)}
        >
          {cMap.map((symptom, index) => {
            return (
              <Radio key={index} label={symptom} value={String(index)}></Radio>
            );
          })}
        </RadioGroup>
        <strong className="bp3-label">Where are you?</strong>
        <LocationSearchInput
          initialState={
            this.props.form &&
            this.props.form.location &&
            this.props.form.location.address
          }
          onChange={this.onAddressChange}
        ></LocationSearchInput>
        <ReCAPTCHA
          theme={"light"}
          size={"normal"}
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY as string}
          onChange={this.onChangeCaptcha}
        />
      </div>
    );
  }
  render(): JSX.Element {
    return (
      <Fragment>
        {this.renderBody()}
        <Button
          className="form-submit"
          large
          disabled={!this.isValid}
          onClick={this.submit}
        >
          Submit Status and Go to Map
        </Button>
      </Fragment>
    );
  }
}
