import React, {
	Component
} from 'react';
import './googleauth.scss';
import copy from 'copy-to-clipboard';
import { Steps, Icon, Carousel,Input,notification } from 'antd';
const { Step } = Steps;
import {connect} from 'dva';

@connect(
	state => ({
    pic:state.googleauth.pic,
    code:state.googleauth.code
	}),
	{
		getQRImg: () => ({
			type:'googleauth/getQRImg'
    }),
    finishBindQR: payload => ({
      type:'googleauth/finishBindQR',
      payload
		})
	}
)
export default class center extends Component {
  constructor(props) {
		super(props);
		this.state = {
      indexNum:0,
      stepStatus1:'',
      stepStatus2:'',
      stepStatus3:'',
      googleCode:''
    };
  }
  
  prevStep = ()=>{
    this.refs.img.prev();
    let stepStatus1 = '';
    let stepStatus2 = '';
    let stepStatus3 = '';
    if(this.state.indexNum > 0){
      stepStatus1 = 'process';
    }
    if(this.state.indexNum > 1){
      stepStatus2 = 'process';
    }
    if(this.state.indexNum > 2){
      stepStatus3 = 'process';
    }
    this.state.indexNum--;
    this.setState({
      indexNum:this.state.indexNum,
      stepStatus1:stepStatus1,
      stepStatus2:stepStatus2,
      stepStatus3:stepStatus3,
    })
  }
  nextStep = () => {
    this.refs.img.next();
    
    let stepStatus1 = '';
    let stepStatus2 = '';
    let stepStatus3 = '';
    if(this.state.indexNum >= 0){
      stepStatus1 = 'process';
    }
    if(this.state.indexNum >= 1){
      stepStatus2 = 'process';
    }
    if(this.state.indexNum >= 2){
      stepStatus3 = 'process';
    }
    this.state.indexNum++;
    this.setState({
      indexNum:this.state.indexNum,
      stepStatus1:stepStatus1,
      stepStatus2:stepStatus2,
      stepStatus3:stepStatus3,
    })
  };

  copyValue = ()=>{
    if(copy(this.props.code)){
      console.log('复制成功')
    }else{
      console.log('复制失败')
    }
  }

  onChangeGoogleCode = (e) => {
    this.setState({
      googleCode:e.target.value
    })
  }

  finishCode = ()=>{
    if(!this.state.googleCode){
      notification.warn({
        message: `填写谷歌验证码`
      });
      return;
    }
    this.props.finishBindQR({
      code:this.props.code,
      googleCode:this.state.googleCode
    });
  }

  componentDidMount(){
    this.props.getQRImg();
  }

	render() {
		return ( 
      <div className="google-auth-page">
        <Steps current={this.state.indexNum} labelPlacement="vertical" status="process">
          <Step title="下载APP" status={this.state.stepStatus1}/>
          <Step title="扫描二维码" status={this.state.stepStatus2}/>
          <Step title="备份密钥" status={this.state.stepStatus3}/>
          <Step title="启用谷歌验证"/>
        </Steps>
        <Carousel dots="false" ref='img'>
          <div className="step-01 step">
            <div className="sub1">步骤1</div>
            <div className="sub2">下载谷歌验证APP</div>
            <div className="content-01">
              <div className="box apple">
                <div className="item">
                  <Icon type="apple" style={{fontSize:'30px'}}/>
                </div>
                <div className="content">
                  <div>Download from</div>
                  <div>APP Store</div>
                </div>
              </div>
              <div className="box google">
                <div className="item">
                  <Icon type="google" style={{fontSize:'30px'}}/>
                </div>
                <div className="content">
                  <div>Download from</div>
                  <div>Google Play</div>
                </div>
              </div>
            </div>
            <div className="next-btn" onClick={this.nextStep}>
              下一步
            </div>
          </div>
          <div className="step-01 step">
            <div className="sub1">步骤2</div>
            <div className="sub2">用谷歌验证App扫描这个二维码</div>
            <div className="content-02">
              <div className="QR-img">
                {this.props.pic?<img src={'data:image/jpeg;base64,'+this.props.pic}/>:''}
              </div>
              <div className="QR-content">
                <div className="top">
                  如果您无法扫描这个二维码，请在App中手动输入这串字符
                </div>
                <div className="bottom">
                  {this.props.code} <span onClick={this.copyValue}>复制</span>
                </div>
              </div>
            </div>
            <div className="next-btn" onClick={this.nextStep}>
              下一步
            </div>
            <div className="prev-btn" onClick={this.prevStep}>上一步</div>
          </div>
          <div className="step-01 step">
            <div className="sub1">步骤3</div>
            <div className="sub2">请把密钥写在纸上。当丢失时，这串密钥能够帮助您重置谷歌验证</div>
            <div className="content-02 content-03">
              <div className="QR-img">
                <img src="http://www.xex-dev.com/images/downUrl.png"/>
              </div>
              <div className="QR-content">
                <div className="bottom">
                  {this.props.code}
                </div>
              </div>
            </div>
            <div className="next-btn" onClick={this.nextStep}>
              下一步
            </div>
            <div className="prev-btn" onClick={this.prevStep}>上一步</div>
          </div>
          <div className="step-01 step">
            <div className="sub1">步骤4</div>
            <div className="sub2">请输入谷歌验证App上的验证码</div>
            <div className="content-04">
              <Input size="large" placeholder="谷歌验证码" id="googlecode" onChange={this.onChangeGoogleCode} />
            </div>
            <div className="next-btn" onClick={this.finishCode}>
              完成
            </div>
            <div className="prev-btn" onClick={this.prevStep}>上一步</div>
          </div>
        </Carousel>
        
      </div>
    )
  }
}