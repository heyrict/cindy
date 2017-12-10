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
  PageHeader
} from "react-bootstrap";
import { MondaiListUL } from "./elements/mondai_list.jsx";
import "jquery";
import * as common from "../common";

var $ = jQuery;

// NavBar Related Components {{{1
// {{{2 class UserDropDown
class UserDropDown extends React.Component {
  render() {
    return null;
  }
}
// {{{2 const mainNavBar
var renderIndexBody = () =>
  ReactDOM.render(<IndexBody />, document.getElementById("root"));
var renderMondaiListBody = () =>
  ReactDOM.render(<MondaiListBody />, document.getElementById("root"));
const mainNavBar = (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>Cindy</Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#" onClick={renderIndexBody}>
          {gettext("Homepage")}
        </NavItem>
        <NavDropdown
          title={gettext("Soup")}
          eventKey={3}
          id="mainnavbar-soup-dropdown"
        >
          <MenuItem eventKey="3.1" onClick={renderMondaiListBody}>
            {gettext("All Soups")}
          </MenuItem>
          <MenuItem eventKey="3.2">{gettext("New Soup")}</MenuItem>
        </NavDropdown>
        <NavItem name={gettext("User List")} />
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

// Homepage Related {{{1
// {{{2 const hero
function HomepageHero() {
  return (
    <Jumbotron bsClass="jumbotron indexHero">
      <Col xs={12} md={3}>
        <Image
          src="/static/pictures/cindylogo.png"
          responsive
          rounded
          thumbnail
        />
      </Col>
      <Col xs={12} md={9}>
        <h2>「Cindy」へようこそ!</h2>
        <p>
          Cindy is a MIT licensed open-source project aiming to build a forum of
          lateral thinking problems.
        </p>
      </Col>
      <Clearfix />
    </Jumbotron>
  );
}

// {{{2 function IndexBody()
function IndexBody() {
  return (
    <div className="container">
      <HomepageHero />
    </div>
  );
}

// MondaiList Related {{{1
// {{{2 function MondaiListBody()
function MondaiListBody() {
  return (
    <div className="container">
      <PageHeader>{gettext("All Soups")}</PageHeader>
      <MondaiListUL post={{ filter: '{"status__exact":0}' }} />
      <hr />
      <MondaiListUL post={{ filter: '{"status__gt":0}' }} />
    </div>
  );
}

// {{{1 Entry Point
function getCurrentPage(url, params) {
  var additPath = url
    .replace(/\/$/, "")
    .split("/")
    .slice(2);

  if (additPath.length == 0) {
    return <IndexBody />;
  } else if (additPath[0] == "mondai") {
    return <MondaiListBody />;
  } else {
    return <IndexBody />;
  }
}

$(document).ready(function() {
  // Popover initialization on top of react-bootstrap
  $("body").popover({
    selector: "[data-toggle='popover']",
    placement: "top",
    trigger: "focus",
    html: true
  });

  var params = common.getURLParameter(),
    url = window.location.pathname;

  ReactDOM.render(getCurrentPage(url, params), document.getElementById("root"));
  ReactDOM.render(mainNavBar, document.getElementById("MainNavBar"));
});
