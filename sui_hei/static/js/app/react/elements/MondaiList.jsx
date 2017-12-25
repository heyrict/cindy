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
import { QueryRenderer, graphql } from "react-relay";
import environment from "../Environment";
import * as common from "../../common";

// {{{1 function MondaiListItem
export function MondaiListItem(props) {
  const node = props.item.node,
    cursor = props.item.cursor;

  var starCount = 0,
    starSum = 0;

  node.starSet.edges.forEach(s => {
    starSum += s.node.value;
    starCount++;
  });

  return (
    <div className="row show-grid">
      <div className="col-xs-4 col-sm-2 col-md-2 col-lg-1 text-center">
        <MondaiStatusLable status={node.status} />
      </div>
      <div className="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-center">
        <MondaiProcessLabel
          qCount={node.quesCount}
          uaCount={node.uaquesCount}
        />
      </div>
      <div className="visible-xs-block col-xs-6 text-right">
        <MondaiGiverLabel user={node.user} />
        <MondaiCreatedLabel time={node.created} />
      </div>
      <span className="visible-xs-block clearfix" />
      <div className="col-xs-12 col-sm-9 col-md-9 col-lg-10">
        <MondaiTitleLabel
          mondaiId={node.id}
          genre={node.genre}
          title={node.title}
        />
        <MondaiScoreLabel starCount={starCount} starSum={starSum} />
      </div>
      <div className="hidden-xs col-sm-12 text-right">
        <MondaiGiverLabel user={node.user} />
        <MondaiCreatedLabel time={node.created} />
      </div>
      <span className="clearfix" />
    </div>
  );
}

// {{{1 class MondaiListUL
/* {{{2 old implementation
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
}}}2 */
// {{{2 query MondaiListQuery
const MLQuery = graphql`
  query MondaiListQuery {
    allMondais {
      edges {
        cursor
        node {
          id
          genre
          title
          created
          quesCount
          uaquesCount
          starSet {
            edges {
              node {
                value
              }
            }
          }
          user {
            id
            nickname
            currentAward {
              award {
                name
                description
              }
              created
            }
          }
        }
      }
    }
  }
`;
// }}}2

export class MondaiListUL extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={MLQuery}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            var data = props.allMondais.edges;
            return data.map(item => (
              <MondaiListItem item={item} key={item.cursor} />
            ));
          }
          return <ProgressBar now={100} label={"Loading..."} striped active />;
        }}
      />
    );
  }
}
