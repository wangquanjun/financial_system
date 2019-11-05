import React, {
	Component
} from 'react';
import {
	Icon
} from 'antd';
import './index.scss';
import router from "umi/router";

export default class center extends Component {
	constructor(props) {
		super(props);
		console.log('23123')
		this.state = {
			username:JSON.parse(localStorage.getItem('userinfo')).email,
			isNeedGoogleAuth:localStorage.getItem('isNeedGoogleAuth')
		};
	}

	handleBindGoogleAuth(){
		router.push('/account/center/googleauth');
	}

	handleDisGoogleAuth(){
		router.push('/account/center/googleauthdis');
	}

	handleUpdatePw(){
		router.push('/account/center/update');
	}

	render() {
		return ( 
			<div className = "account-center" >
				<div className = "account-icon">{this.state.username.substring(0,1)}</div>
				<div className = "account-username">{this.state.username}</div>
				<div className = "account-panel">
					<div className="box pw-panel">
						<div className="up-password">
							<div className="up-left">
								<div className="tit1">
									登录密码
								</div>
								<div className="tit2">
									用于登录验证
								</div>
							</div>
							<div className="up-right">
								<Icon type="key" style={{fontSize:'60px'}} className="key-icon"/>
							</div>
						</div>
						<div className="up-box">
							<div className="up-btn" onClick={this.handleUpdatePw}>修改</div>
						</div>
					</div>
					<div className="box google-auth pw-panel">
						<div className="up-password">
							<div className="up-left">
								<div className="tit1">
									谷歌验证
								</div>
								<div className="tit2">
									用于登录、提币时的安全验证
								</div>
							</div>
							<div className="up-right">
								<Icon type="key" style={{fontSize:'60px'}} className="key-icon"/>
							</div>
						</div>
						<div className="up-box">
							{this.state.isNeedGoogleAuth == 1?<div className="up-btn" onClick={this.handleDisGoogleAuth}>解绑</div>:<div className="up-btn" onClick={this.handleBindGoogleAuth}>启动</div>}
							
						</div>
					</div>
				</div>
			</div>
		)
	}
}