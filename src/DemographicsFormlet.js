import React, { Fragment, memo } from "react";
import "@elastic/eui/dist/eui_theme_amsterdam_light.css";
import * as Yup from "yup";

import {
  EuiFormRow,
  EuiFieldText,
  EuiSuggest,
  EuiText,
  EuiSelect
} from "@elastic/eui";

const formatQuery = (dataModel) => {
  let myQuery = {};
  if (dataModel.first && dataModel.first.length > 0) {
    myQuery.x = 1;
  }
  return myQuery;
};

const lastNameSuggestions = [
  {
    type: { iconType: "kqlField", color: "tint4" },
    label: "Gary"
  },
  {
    type: { iconType: "kqlField", color: "tint4" },
    label: "Kent"
  }
];

const DemographicFormlet = {
  meta: () => {
    return {
      id: "patientDemo",
      title: "Patient Demographics",
      descr: "Used to search for a single patient via demographics.",
      version: "0.1",
      author: "Kent Bulza"
    };
  },

  validationSchema: () => {
    return Yup.object({
      first: Yup.string().when("$firstName", () => {
        return Yup.string().required().min(1).max(10);
      }),
      last: Yup.string().when("$lastName", () => {
        return Yup.string().required().min(1).max(10);
      }),
      phoneNumber: Yup.string().when("$phoneNumber", () => {
        return Yup.string()
          .matches(
            /^[0123456789]+$/,
            "Phone number may only contain digits 0-9"
          )
          .max(15, "Phone number cannot be greater than 15 digits")
          .min(7, "Phone number must be at least 7 digits");
      })
    });
  },

  model: () => {
    return {
      first: undefined,
      last: undefined,
      gender: undefined,
      dob: undefined,
      phoneNumber: undefined
    };
  },

  defaultValues: () => {
    return {
      first: "",
      last: "",
      phoneNumber: ""
    };
  },

  generateQuery: (formData) => {
    return formatQuery(formData);
  },

  Formlet: memo(({ handleChange, errors, values, setFieldValue }) => {
    return (
      <Fragment>
        <EuiFormRow label="First Name" helpText={errors.first}>
          <EuiFieldText
            name="first"
            value={values.first}
            compressed
            onChange={handleChange}
          />
        </EuiFormRow>

        <EuiFormRow label="Last Name" helpText={errors.last}>
          <EuiSuggest
            key="_lastName"
            name="last"
            value={values.last}
            compressed
            suggestions={lastNameSuggestions}
            onChange={handleChange}
          />
        </EuiFormRow>

        <EuiFormRow label="Phone Number" helpText={errors.phoneNumber}>
          <EuiFieldText
            name="phoneNumber"
            prepend="+"
            compressed
            placeholder="Enter a phone number"
            onChange={handleChange}
          />
        </EuiFormRow>

        <EuiFormRow label="Gender" labelAppend={<EuiText size="xs"></EuiText>}>
          <EuiSelect
            hasNoInitialSelection
            onChange={(e) => handleChange(e)}
            options={[
              { value: "M", text: "Male" },
              { value: "F", text: "Female" },
              { value: "O", text: "Other" }
            ]}
          />
        </EuiFormRow>
      </Fragment>
    );
  })
};

export default DemographicFormlet;
