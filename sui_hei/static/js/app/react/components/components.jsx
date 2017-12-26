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
  Pagniation
} from "react-bootstrap";
import { Link } from "react-router-dom"
import "jquery";
import * as common from "../../common";

// {{{1 function StatusLabel(props)
export function StatusLabel(props) {
  var baseClass = "status_label " + props.extClass;
  return <div className={baseClass}>{props.content}</div>;
}

// {{{1 class MondaiStatusLable
export class MondaiStatusLable extends React.Component {
  render() {
    const status = this.props.status;
    const status_class = common.status_class_dict[status];
    const status_color = common.status_color_dict[status];
    const translatedStatus = common.status_code_dict[status];
    return (
      <StatusLabel
        extClass={status_class}
        color={status_color}
        content={translatedStatus}
      />
    );
  }
}

// {{{1 function ProcessLabel(props)
export function ProcessLabel(props) {
  var baseClass = "process_label " + props.extClass;
  return <div className={baseClass}>{props.content}</div>;
}

// {{{1 class MondaiProcessLabel
export class MondaiProcessLabel extends React.Component {
  render() {
    const qCount = this.props.qCount;
    const uaCount = this.props.uaCount;
    const content = uaCount + "/" + qCount;
    if (uaCount == 0) {
      return <ProcessLabel extClass="answered" content={content} />;
    } else {
      return <ProcessLabel extClass="unanswered" content={content} />;
    }
  }
}

// {{{1 class MondaiTitleLabel
export class MondaiTitleLabel extends React.Component {
  render() {
    const translatedGenre = common.genre_code_dict[this.props.genre];
    return (
      <span className="title_label">
        <span className="glyphicon glyphicon-chevron-right visible-xs-inline" />
        <Link to={common.urls.mondai_show(this.props.mondaiId)}>
          {`[${translatedGenre}] ${this.props.title}`}
        </Link>
      </span>
    );
  }
}

// {{{1 class MondaiScoreLabel
export class MondaiScoreLabel extends React.Component {
  render() {
    var scale_one = num => Math.floor(num * 10) / 10;
    const starCount = this.props.starCount,
      starSum = this.props.starSum;
    if (starCount > 0) {
      return (
        <span className="mondai_score">
          {"✯" + starSum + "(" + starCount + ")"}
        </span>
      );
    } else {
      return "";
    }
  }
}
// {{{1 class MondaiGiverLabel
export class MondaiGiverLabel extends React.Component {
  render() {
    const user = this.props.user;
    return (
      <span>
        <Link to={common.urls.profile(user.rowid)}>{user.nickname}</Link>
        <UserAwardPopup userAward={user.currentAward} />
      </span>
    );
  }
}

// {{{1 class MondaiCreatedLabel
export class MondaiCreatedLabel extends React.Component {
  render() {
    const time = this.props.time;
    return (
      <font color="#888">
        [{gettext("created")}:{moment(time).calendar()}]
      </font>
    );
  }
}

// {{{1 class UserAwardPopup
export class UserAwardPopup extends React.Component {
  render() {
    const ua = this.props.userAward;
    if (!ua) {
      return "";
    } else {
      const award_content = `
${ua.award.description}<br />
<span class='pull-right' style='color:#ff582b; font-weight:bold;'>
  🏆${ua.created}
</span>`;
      return (
        <a
          tabIndex="0"
          href="javascript:void(0);"
          role="button"
          style={{ color: "black" }}
          data-toggle="popover"
          title={ua.award.name}
          data-content={award_content}
        >
          [{ua.award.name}]
        </a>
      );
    }
  }
}
