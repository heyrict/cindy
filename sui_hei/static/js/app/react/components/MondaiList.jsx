// {{{1 Imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ProgressBar, PageHeader } from "react-bootstrap";
import "jquery";

import {
  MondaiCreatedLabel,
  MondaiGiverLabel,
  MondaiProcessLabel,
  MondaiScoreLabel,
  MondaiStatusLable,
  MondaiTitleLabel
} from "./components.jsx";
import { QueryRenderer, graphql, createFragmentContainer } from "react-relay";
import { environment } from "../Environment";
import * as common from "../../common";

// {{{1 Containers
// {{{2 function MondaiListItem
export function MondaiListItem(props) {
  const node = props.node;

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
          mondaiId={node.rowid}
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

// {{{2 class MondaiListEdge
class MondaiListEdge extends React.Component {
  render() {
    const edge = this.props.edge;
    return <MondaiListFragmentItem node={edge.node} key={edge.cursor} />;
  }
}

// {{{2 class MondaiListList
class MondaiListList extends React.Component {
  render() {
    const list = this.props.list;
    return (
      <div>
        {list.edges.map(edge => (
          <MondaiListFragmentEdge edge={edge} key={edge.__id} />
        ))}
      </div>
    );
  }
}

// {{{1 Fragments
// {{{2 fragment MondaiListQuery
export const MondaiListFragmentItem = createFragmentContainer(MondaiListItem, {
  node: graphql`
    fragment MondaiList_node on MondaiNode {
      id
      rowid
      genre
      title
      status
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
        rowid
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
  `
});
// {{{2 fragment MondaiList_edge
export const MondaiListFragmentEdge = createFragmentContainer(
  MondaiListEdge,
  graphql`
    fragment MondaiList_edge on MondaiNodeEdge {
      cursor
      node {
        ...MondaiList_node
      }
    }
  `
);

// {{{2 fragment MondaiList_list
export const MondaiListFragmentList = createFragmentContainer(
  MondaiListList,
  graphql`
    fragment MondaiList_list on MondaiNodeConnection {
      edges {
        ...MondaiList_edge
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `
);

// {{{2 query MondaiListQuery
const mondaiListBodyQuery = graphql`
  query MondaiListQuery(
    $orderBy: [String]
    $status: Float
    $status__gt: Float
  ) {
    allMondais(orderBy: $orderBy, status: $status, status_Gt: $status__gt) {
      ...MondaiList_list
    }
  }
`;

// {{{1 Body
// {{{2 function MondaiListQueryRenderer
function MondaiListQueryRenderer(props) {
  return (
    <QueryRenderer
      environment={environment}
      component={MondaiListFragmentList}
      query={mondaiListBodyQuery}
      variables={props.variables}
      render={({ error, props }) => {
        if (error) {
          return <div>{error.message}</div>;
        } else if (props) {
          return <MondaiListFragmentList list={props.allMondais} />;
        }
        return <ProgressBar now={100} label={"Loading..."} striped active />;
      }}
    />
  );
}

// {{{2 class MondaiListBody
export class MondaiListBody extends React.Component {
  render() {
    return (
      <div className="container">
        <PageHeader>{gettext("All Soups")}</PageHeader>
        <MondaiListQueryRenderer
          variables={{
            orderBy: ["-modified", "-id"],
            status: 0,
            status__gt: null
          }}
        />
        <hr />
        <MondaiListQueryRenderer
          variables={{
            orderBy: ["-modified", "-id"],
            status: null,
            status__gt: 0
          }}
        />
      </div>
    );
  }
}
