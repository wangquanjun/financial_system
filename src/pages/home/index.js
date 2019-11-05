import React from 'react';
import './index.scss';
import {connect} from 'dva';

@connect(
	state => ({
		code:state.register.code
	}),
	{
		gotoRegister: cart => ({
			type:'register/gotoRegister',
			cart:cart
		})
	}
)
class RegistrationForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			showGoogleRecaptcha:false,
			countDownTime:60,
			isStartSendCode:false,
			codeText:'获取验证码'
		}
	}
	componentDidMount(){
		
	}
	
	render() {
		return (
			<div className="home-page">
				home
				
			</div>
		)
	}
}

export default RegistrationForm