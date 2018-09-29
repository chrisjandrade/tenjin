import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Navbar, NavbarGroup, NavbarHeading, Alignment, Button } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

import AnalyzeService from './services/analyze-service';

class App extends React.Component {

	analyzeService = new AnalyzeService();

	analyze = () => {
		this.analyzeService.analyze();
	};

	render() {
		return (
			<Router>
				<div className="app-container bp3-dark">
					<Navbar fixedToTop>
            <NavbarGroup align={ Alignment.LEFT }>
              <NavbarHeading>TENJIN</NavbarHeading>
            </NavbarGroup>
						<NavbarGroup align={ Alignment.RIGHT }>
							<Button icon="folder-new" onClick={ this.analyze }>Analyze</Button>
						</NavbarGroup>
          </Navbar>

    		</div>
			</Router>
		);
	}

}

ReactDOM.render(
	<App/>,
	document.querySelector('#content'));