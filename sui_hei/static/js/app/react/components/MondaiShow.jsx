// {{{1 Imports
import React from "react";
import ReactDOM from "react-dom";
import { Grid, ProgressBar, PageHeader, Button } from "react-bootstrap";
import "jquery";

import {
  MondaiCreatedLabel,
  MondaiGiverLabel,
  MondaiProcessLabel,
  MondaiScoreLabel,
  MondaiStatusLable,
  MondaiTitleLabel
} from "./components.jsx";
import {
  QueryRenderer,
  graphql,
  createFragmentContainer,
  createPaginationContainer
} from "react-relay";
import { environment } from "../Environment";
import common from "../../common";

// {{{1 Containers


// {{{1 Fragments

// {{{1 Body
// {{{2 class MondaiShowBody
export class MondaiShowBody extends React.Component {
  render() {
    const mondaiId = this.props.match.params.mondaiId;
    return <div>Now you are visiting mondai:{mondaiId}</div>;
  }
}
