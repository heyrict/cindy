// {{{1 Imports
import React from "react";
import ReactDOM from "react-dom";
import {
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
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { slide as SideBar } from "react-burger-menu";
import { QueryRenderer } from "react-relay";
import "jquery";

import { MondaiListBody } from "./components/MondaiList.jsx";
import { MondaiAddBody } from "./components/MondaiAdd.jsx";
import { MondaiShowBody } from "./components/MondaiShow.jsx";

import { environment } from "./Environment";
import common from "../common";

var $ = jQuery;

// NavBar Related Components {{{1
// {{{2 class UserDropDown
class UserDropDown extends React.Component {
  render() {
    return (
      <Nav pullRight>
        {window.django.user_id === null ? (
          <NavDropdown
            eventKey={0}
            title={gettext("Hello, guest!")}
            id="mainnavbar-user-dropdown"
          >
            <LinkContainer to="/login">
              <MenuItem eventKey={0.1}>{gettext("Login")}</MenuItem>
            </LinkContainer>
            <LinkContainer to="/register">
              <MenuItem eventKey={0.2}>{gettext("Register")}</MenuItem>
            </LinkContainer>
          </NavDropdown>
        ) : (
          <NavDropdown
            eventKey={0}
            title={gettext("About Me")}
            id="mainnavbar-user-dropdown"
          >
            <LinkContainer to={"/profile/"+window.django.user_id}>
              <MenuItem eventKey={0.3}>{gettext("My Profile")}</MenuItem>
            </LinkContainer>
            <LinkContainer to="/logout">
              <MenuItem eventKey={0.4}>{gettext("Logout")}</MenuItem>
            </LinkContainer>
          </NavDropdown>
        )}
      </Nav>
    );
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
        <LinkContainer to="/">
          <NavItem eventKey={1}>{gettext("Homepage")}</NavItem>
        </LinkContainer>
        <NavDropdown
          title={gettext("Soup")}
          eventKey={3}
          id="mainnavbar-soup-dropdown"
        >
          <LinkContainer to="/mondai">
            <MenuItem eventKey="3.1">{gettext("All Soups")}</MenuItem>
          </LinkContainer>
          <LinkContainer to="/mondai/add">
            <MenuItem eventKey="3.2">{gettext("New Soup")}</MenuItem>
          </LinkContainer>
        </NavDropdown>
        <NavItem name={gettext("User List")} />
      </Nav>
      <UserDropDown />
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

// SideBar Related {{{1
// {{{2 var leftBarStyles
var leftBarStyles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    left: "36px",
    top: "66px"
  },
  bmBurgerBars: {
    background: "#fcf4dc"
  },
  bmCrossButton: {
    height: "24px",
    width: "24px"
  },
  bmCross: {
    background: "#bdc3c7"
  },
  bmMenu: {
    background: "#fcf4dc",
    border: "4px solid #00d6b6",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em"
  },
  bmMorphShape: {
    fill: "#373a47"
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em"
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)"
  }
};
// {{{2 class LeftBar
class LeftBar extends React.Component {
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <SideBar
        width={window.innerWidth < 768 ? "100%" : "33%"}
        styles={leftBarStyles}
        customBurgerIcon={<img src="/static/pictures/chat.png" />}
      >
        <div>Sidebar is still Under Construction ...</div>
      </SideBar>
    );
  }
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
// {{{1 Entry Point
const App = () => (
  <BrowserRouter>
    <div>
      <LeftBar />
      <noscript>This appication requires javascript to function</noscript>
      {mainNavBar}
      <Switch>
        <Route exact path="/" component={IndexBody} />
        <Route exact path="/mondai" component={MondaiListBody} />
        <Route exact path="/mondai/show/:mondaiId" component={MondaiShowBody} />
        <Route exact path="/mondai/add" component={MondaiAddBody} />
        <Route exact path="/test" render={() => <h1>TEST</h1>} />
        <Route render={() => <h1>NOT FOUND!</h1>} />
      </Switch>
    </div>
  </BrowserRouter>
);

$(document).ready(function() {
  // Popover initialization on top of react-bootstrap
  $("body").popover({
    selector: "[data-toggle='popover']",
    placement: "top",
    trigger: "focus",
    html: true
  });

  ReactDOM.render(<App />, document.getElementById("root"));
});
