import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';



const ParticlesOptions = {
	particles: {
		number:{
			value:100,
			density:{
				enable: true,
				value_area: 1000
			}
		}
	}
}

const initialState = {

			input: '',
			imageUrl:'',
			box: {},
			route: 'SignIn',
			isSignedIn: false,
			users: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: ''
			}
		} 


class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUsers = (data) => {
		this.setState({users: {
			id: data.id,
			name: data.name,
			email: data.email,
			entries: data.entries,
			joined: data.joined
		}})
	}

	faceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		return{
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}


	displayFaceBox = (box) => {
		this.setState({box: box});
	}

	OnInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		fetch('https://secret-shore-88575.herokuapp.com/imageurl', {
					method: 'post',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						input: this.state.input
					})
				})
		.then(response => response.json())
		.then( response => {
			if (response) {
				fetch('https://secret-shore-88575.herokuapp.com/image', {
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						id: this.state.users.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState(Object.assign(this.state.users, {entries: count}))
				})
				.catch(console.log);

			}
		this.displayFaceBox(this.faceLocation(response))
	})
        .catch(error => console.log(error));
	}

	onRouteChange =(route) =>{
		if (route === 'signOut') {
			this.setState(initialState)
		} else if (route === 'home'){
			this.setState({isSignedIn: true})
		}
		this.setState({route: route});
	}

  render() {
  	const {isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
    	<Particles  className='particles'
                params={{ParticlesOptions}} 
        />
      <Navigation isSignedIn={ isSignedIn } onRouteChange= { this.onRouteChange } />
      { route === 'home' 

      ?<div>
	      <Logo/>
	      <Rank name={this.state.users.name} entries={this.state.users.entries}/>
	      <ImageLinkForm OnInputChange={ this.OnInputChange } onButtonSubmit = { this.onButtonSubmit }/>
	      <FaceRecognition box={box} imageUrl={imageUrl}/>
      	</div>
      : (
      	route === 'SignIn'
      	? <SignIn onRouteChange={this.onRouteChange} loadUsers={this.loadUsers}/>
      	: <Register loadUsers={this.loadUsers} onRouteChange={this.onRouteChange}/> 
      )
       
  	}
    </div>
    );
  }
}

export default App;
