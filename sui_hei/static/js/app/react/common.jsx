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
import "jquery";
import * as common from "../common";

// {{{1 class Bubble
export class Bubble extends React.Component {
  render() {
    return (
      <span className={this.props.baseClass}>
        <font color={this.props.color}>{this.props.content}</font>
      </span>
    );
  }
}

// {{{1 function StatusLabel(props)
export function StatusLabel(props) {
  var baseClass = "status_label " + props.extClass;
  return (
    <Bubble baseClass={baseClass} color={props.color} content={props.content} />
  );
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
  return (
    <Bubble baseClass={baseClass} color={props.color} content={props.content} />
  );
}

// {{{1 class MondaiProcessLabel
export class MondaiProcessLabel extends React.Component {
  render() {
    const qCount = this.props.qCount;
    const uaCount = this.props.uaCount;
    const content = (
      <span>
        {uaCount}
        <sub>{qCount}</sub>
      </span>
    );
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
      <Bubble
        baseClass="title_label"
        content={
          <a href={common.urls.mondai_show(this.props.mondaiId)}>
            {`[${translatedGenre}] ${this.props.title}`}
          </a>
        }
      />
    );
  }
}

// {{{1 class MondaiScoreLabel
export class MondaiScoreLabel extends React.Component {
  render() {
    var scale_one = num => Math.floor(num * 10) / 10;
    const score = this.props.score;
    const star_count = this.props.star_count;
    if (star_count > 0) {
      return (
        <span className="mondai_score">
          {scale_one(score) + "✯" + star_count}
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
        <a href={common.urls.profile(user.id)}>{user.nickname}</a>
        <UserAwardPopup userAward={user.current_award} />
      </span>
    );
  }
}

// {{{1 class UserAwardPopup
export class UserAwardPopup extends React.Component {
  render() {
    const ua = this.props.award
    if (!ua) {
      return "";
    } else {
      const award_content = `
${data.award_id[0].description}<br />
<span class='pull-right' style='color:#ff582b; font-weight:bold;'>
  🏆${data.created}
</span>`;
      return (
        <a
          tabindex="0"
          href="javascript:void(0);"
          role="button"
          style="color:black;"
          data-toggle="popover"
          title={data.award_id[0].name}
          data-content={award_content}
        >
          [{data.award_id[0].name}]
        </a>
      );
    }
  }
}
