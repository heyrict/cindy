// {{{1 Imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Button,
  Clearfix,
  Col,
  Image,
  Jumbotron,
  MenuItem,
  Navbar,
  Nav,
  NavItem,
  NavDropdown
} from "react-bootstrap";
import {
  MondaiStatusLable,
  MondaiProcessLabel,
  MondaiTitleLabel,
  MondaiScoreLabel,
  MondaiGiverLabel
} from "../common.jsx";
import "jquery";
import * as common from "../../common";

// {{{1 function MondaiListItem
export function MondaiListItem(props) {
  return (
    <ul>
      <li>
        <MondaiStatusLable status={props.item.status} />
        <MondaiProcessLabel
          qCount={props.item.quescount_all}
          uaCount={props.item.quescount_unanswered}
        />
        <MondaiTitleLabel
          mondaiId={props.item.id}
          genre={props.item.genre}
          title={props.item.title}
        />
        <MondaiScoreLabel
          star_count={props.item.star_count}
          score={props.item.score}
        />
        <span className="pull-right">
          <MondaiGiverLabel user={props.item.user_id} />
        </span>
      </li>
    </ul>
  );
}

// {{{1 class MondaiListUL
export class MondaiListUL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: []
    };
  }

  componentDidMount() {
    $.post(
      common.urls.mondai_list_api,
      {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "-modified"
      },
      result => {
        this.setState({
          isLoaded: true,
          data: result.data
        });
      }
    );
  }

  render() {
    const { error, isLoaded, data } = this.state;
    if (error) {
      return <div>Error: {error}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {data.map(item => <MondaiListItem item={item} key={item.id} />)}
        </div>
      );
    }
  }
}
