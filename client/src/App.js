import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom"

import Home from "./pages/index.js"
import About from "./pages/about.js"
import Predictor from "./pages/predictor.js"
import Structure from "./pages/structure.js"
import Results from "./pages/results.js"

function App() {
	return (
	 <Router basename={process.env.REACT_APP_BASE}>
		 <Route path="/" exact component={Home} />
		 <Route path="/about" exact component={About} />
		 <Route path="/predictor" exact component={Predictor} />
		 <Route path="/structure" exact component={Structure} />
		 <Route path="/predictor/results/:requestId" component={Results} />
	 </Router>
  );
}

export default App;
