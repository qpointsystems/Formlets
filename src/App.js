import React, { useState, memo } from "react";
import "./styles.css";
import { useFormik } from "formik";
import {
  EuiPageTemplate,
  EuiForm,
  EuiButton,
  EuiModal,
  EuiSpacer,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiComboBox,
  EuiHorizontalRule,
  EuiCodeBlock,
  EuiFormRow
} from "@elastic/eui";

import DemographicsFormlet from "./DemographicsFormlet";

const formlets = [
  {
    label: DemographicsFormlet.meta().title,
    formlet: DemographicsFormlet
  }
];

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFormlet, setSelected] = useState(undefined);
  const [formletData, setFormletData] = useState(undefined);

  const [query, setQuery] = useState(undefined);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const FormletPopup = memo(({ closeModal, targetFormlet, setFormletData }) => {
    const validationSchema = targetFormlet.validationSchema;

    const {
      handleSubmit,
      handleChange,
      values,
      errors,
      setFieldValue,
      resetForm
    } = useFormik({
      initialValues: targetFormlet.defaultValues,
      enableReinitialize: true,
      validationSchema,
      onSubmit(values) {
        doSubmit(values);
      }
    });

    const doSubmit = (e) => {
      setFormletData(values);
      setQuery(targetFormlet.generateQuery(values));
      closeModal();
    };

    return (
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{targetFormlet.meta().title}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm component="form" onSubmit={handleSubmit}>
            <DemographicsFormlet.Formlet
              handleChange={handleChange}
              values={values}
              errors={errors}
              setFieldValue={setFieldValue}
            />
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>

          <EuiButton fill type="submit" form="modalFormlet" onClick={doSubmit}>
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  });

  const onChangeFormlet = (selectedFormlet) => {
    setSelected(selectedFormlet);
  };

  return (
    <div className="App" style={{ margin: 40 }}>
      <EuiPageTemplate
        pageHeader={{
          iconType: "logoElastic",
          pageTitle: "Formlet Testbench"
        }}
      >
        <EuiFormRow label="Current Formlets">
          <EuiComboBox
            placeholder="Select a Formlet to test"
            options={formlets}
            singleSelection={{ asPlainText: true }}
            selectedOptions={selectedFormlet}
            onChange={onChangeFormlet}
          />
        </EuiFormRow>
        <EuiSpacer size="l" />
        <EuiFormRow>
          <EuiButton
            onClick={showModal}
            style={{ width: 200 }}
            isDisabled={!selectedFormlet}
          >
            Test Formlet
          </EuiButton>
        </EuiFormRow>
        {isModalVisible && (
          <FormletPopup
            closeModal={closeModal}
            targetFormlet={DemographicsFormlet}
            setFormletData={setFormletData}
            setQuery={setQuery}
          />
        )}
        <EuiHorizontalRule />
        <EuiFormRow label="Generated Query">
          <EuiCodeBlock isCopyable language="json">
            {JSON.stringify(query, null, 2)}
          </EuiCodeBlock>
        </EuiFormRow>
        <EuiFormRow label="Formlet Data">
          <EuiCodeBlock isCopyable language="json">
            {JSON.stringify(formletData, null, 2)}
          </EuiCodeBlock>
        </EuiFormRow>
      </EuiPageTemplate>
    </div>
  );
}
