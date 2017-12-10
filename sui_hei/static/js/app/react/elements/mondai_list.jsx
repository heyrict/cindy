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
  NavDropdown,
  ProgressBar
} from "react-bootstrap";
import {
  MondaiCreatedLabel,
  MondaiGiverLabel,
  MondaiProcessLabel,
  MondaiScoreLabel,
  MondaiStatusLable,
  MondaiTitleLabel
} from "../common.jsx";
import "jquery";
import * as common from "../../common";

// {{{1 function MondaiListItem
export function MondaiListItem(props) {
  return (
    <div className="row show-grid">
      <div className="col-xs-4 col-sm-2 col-md-2 col-lg-1 text-center">
        <MondaiStatusLable status={props.item.status} />
      </div>
      <div className="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-center">
        <MondaiProcessLabel
          qCount={props.item.quescount_all}
          uaCount={props.item.quescount_unanswered}
        />
      </div>
      <div className="visible-xs-block col-xs-6 text-right">
        <MondaiGiverLabel user={props.item.user_id} />
        <MondaiCreatedLabel time={props.item.created} />
      </div>
      <span className="visible-xs-block clearfix" />
      <div className="col-xs-12 col-sm-9 col-md-9 col-lg-10">
        <MondaiTitleLabel
          mondaiId={props.item.id}
          genre={props.item.genre}
          title={props.item.title}
        />
        <MondaiScoreLabel
          star_count={props.item.star_count}
          score={props.item.score}
        />
      </div>
      <div className="hidden-xs col-sm-12 text-right">
        <MondaiGiverLabel user={props.item.user_id} />
        <MondaiCreatedLabel time={props.item.created} />
      </div>
      <span className="clearfix" />
    </div>
  );
}

// {{{1 class MondaiListUL
export class MondaiListUL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: [],
      num_pages: null,
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
        data: result.data,
        num_pages: result.num_pages
      });
    });
  }

  componentDidMount() {
    this.update_post(this.props.post || {});
  }

  render() {
    const { isLoaded, data } = this.state;
    if (!isLoaded) {
      return <ProgressBar now={100} label={"Loading..."} striped active />;
    } else {
      return (
        <div>
          {data.map(item => <MondaiListItem item={item} key={item.id} />)}
        </div>
      );
    }
  }
}
