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
      data: [],
      post: {
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
        order: "-modified",
        items_per_page: 20,
        page: 1
      }
    };
  }

  update_post(newPost) {
    this.setState((prevState, props) => {
      post: $.extend(prevState.post, newPost);
    }, this.reload);
  }

  reload() {
    this.setState({
      isLoaded: false
    });

    $.post(common.urls.mondai_list_api, this.state.post, result => {
      this.setState({
        isLoaded: true,
        data: result.data
      });
    });
  }

  componentDidMount() {
    this.update_post(this.props.post || {});
  }

  render() {
    const { isLoaded, data } = this.state;
    if (!isLoaded) {
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
