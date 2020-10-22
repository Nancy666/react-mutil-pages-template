import React from 'react';
import './App.css';
import { Button } from 'antd';
import { login } from './../service/login'

class App extends React.Component {
	constructor(props) {
		super()
	}
	componentDidMount() {
		login({}).then((res) => {
			console.log(res)
		})
	}
	render() {
		return <div className="App">
			<Button type="primary">Button</Button>
            page1
    </div>
	}
}

export default App;
