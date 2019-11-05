import React, {
	Component
} from 'react';
import './googleauthdis.scss';
import copy from 'copy-to-clipboard';
import { Steps, Icon, Carousel,Input } from 'antd';
const { Step } = Steps;
import {connect} from 'dva';

@connect(
	state => ({}),
	{
    finishDisQR: googlecode => ({
      type:'googleauth/finishDisQR',
      googlecode
		})
	}
)
export default class center extends Component {
  constructor(props) {
		super(props);
		this.state = {
      googleCode:''
    };
  }

  onChangeGoogleCode = (e) => {
    this.setState({
      googleCode:e.target.value
    })
  }

  finishCode = ()=>{
    this.props.finishDisQR(this.state.googleCode);
  }

  componentDidMount(){
    // this.props.getQRImg();
  }

	render() {
		return ( 
      <div className="google-auth-dis-page">
        <div className="tit1">关闭谷歌验证</div>
        <div className="tit2">请输入谷歌验证App上的验证码</div>
        <div className="code-input">
          <Input size="large" placeholder="谷歌验证码" id="googlecode" onChange={this.onChangeGoogleCode} />
        </div>
        <div className="finish-btn" onClick={this.finishCode}>
          完成
        </div>
      </div>
    )
  }
}