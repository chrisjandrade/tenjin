import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Navbar, NavbarGroup, NavbarHeading, Alignment } from '@blueprintjs/core';

class App extends React.Component {

	routingComponents = {
		// ResumeComponent: () => {
		// 	return (<Resume/>);
		// }
	};

	render() {
		const { ResumeComponent } = this.routingComponents;

		return (
			<Router>
				<div className="app-container">
					<Navbar fixedToTop>
            <NavbarGroup align={ Alignment.LEFT }>
              <NavbarHeading>Tenjin</NavbarHeading>
            </NavbarGroup>
          </Navbar>

          TODO: put content here.
    		</div>
			</Router>
		);
	}

}

ReactDOM.render(
	<App/>,
	document.querySelector('#content'));