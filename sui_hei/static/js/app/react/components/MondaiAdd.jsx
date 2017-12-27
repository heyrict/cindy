// {{{1 Imports
import React from "react";
import {
  Button,
  Form,
  FormControl,
  Grid,
  PageHeader,
  Panel
} from "react-bootstrap";
import { commitMutation } from "react-relay";
import bootbox from "bootbox";

import { FieldGroup, PreviewEditor } from "./components.jsx";
import common from "../../common";
import { environment } from "../Environment";

// {{{1 Containers
// {{{2 class MondaiAddForm
export class MondaiAddForm extends React.Component {
  // {{{ constructor
  constructor(props) {
    super(props);
    this.state = {
      mondaiTitle: "",
      mondaiGenre: 0,
      mondaiYami: false,
      mondaiContent: "",
      mondaiKaisetu: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // }}}
  // {{{ render
  render() {
    return (
      <Form horizontal>
        <FieldGroup
          id="formMondaiAddTitle"
          label={gettext("Title")}
          Ctl={FormControl}
          type="text"
          value={this.state.mondaiTitle}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formMondaiAddGenre"
          label={gettext("Genre")}
          Ctl={() => (
            <FormControl
              componentClass="select"
              value={this.state.mondaiGenre}
              onChange={this.handleChange}
            >
              {Object.entries(common.genre_code_dict).map(entry => (
                <option value={entry[0]} key={entry[0]}>
                  {entry[1]}
                </option>
              ))}
            </FormControl>
          )}
        />
        <FieldGroup
          id="formMondaiAddYami"
          label={gettext("Yami")}
          Ctl={FormControl}
          type="checkbox"
          checked={this.state.mondaiYami}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formMondaiAddContent"
          label={gettext("Content")}
          Ctl={PreviewEditor}
          content={this.state.mondaiContent}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formMondaiAddKaisetu"
          label={gettext("Kaisetu")}
          Ctl={PreviewEditor}
          content={this.state.mondaiKaisetu}
          onChange={this.handleChange}
        />
        <FieldGroup
          id="formMondaiAddSubmit"
          label={gettext("Submit")}
          Ctl={() => (
            <Button type="submit" block onClick={this.handleSubmit}>
              {gettext("Click me")}
            </Button>
          )}
        />
      </Form>
    );
  }
  // }}}
  // {{{ handleChange
  handleChange(e) {
    var target = e.target;
    if (target.id == "formMondaiAddContent") {
      this.setState({ mondaiContent: target.value });
    } else if (target.id == "formMondaiAddKaisetu") {
      this.setState({ mondaiKaisetu: target.value });
    } else if (target.id == "formMondaiAddTitle") {
      this.setState({ mondaiTitle: target.value });
    } else if (target.id == "formMondaiAddGenre") {
      this.setState({ mondaiGenre: target.value });
    } else if (target.id == "formMondaiAddYami") {
      this.setState({ mondaiYami: target.checked });
    }
  }
  // }}}
  // {{{ handleSubmit
  handleSubmit(e) {
    e.preventDefault();
    commitMutation(environment, {
      mutation: MondaiAddMutation,
      variables: { input: { ...this.state } },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(
            errors.map(e => (
              <Panel header={e.message} key={e.message} bsStyle="danger" />
            ))
          );
        } else if (response) {
          const mondaiId = response.createMondai.mondai.rowid;
          this.props.history.push(`/mondai/show/${mondaiId}`);
        }
      },
      onError: err => console.error(err)
    });
  }
  // }}}
}

// {{{1 Fragments
export const MondaiAddMutation = graphql`
  mutation MondaiAddMutation($input: CreateMondaiInput!) {
    createMondai(input: $input) {
      mondai {
        rowid
      }
    }
  }
`;
// {{{1 Body
// {{{2 const MondaiAddBody
export const MondaiAddBody = props => (
  <Grid>
    <PageHeader>{gettext("New Soup")}</PageHeader>
    <MondaiAddForm {...props} />
  </Grid>
);
