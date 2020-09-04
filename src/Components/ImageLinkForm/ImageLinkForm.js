import React from 'react';
import './ImageLinkForm.css';



const ImageLinkForm = ({ OnInputChange, onButtonSubmit }) => {
return(
	<div className= 'ma4 mt0'>
		<p className='f3 red'>
			{'This Magic Brain will detect faces in your picture. Give it a try!'}
		</p>
		<div className='center'>
			<div className=' form pa4 br3 shadow-5 center'>
				<input type="text" className='f4 pa2 w-70 center' onChange ={ OnInputChange }/>
				<button className='w-30 grow f4 link ph3 pv2  dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
			</div>
		</div>
	</div>
	);
}

export default ImageLinkForm;