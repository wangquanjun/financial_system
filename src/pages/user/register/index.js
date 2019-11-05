import React from 'react';
import './register.scss';
import {connect} from 'dva';
import Recaptcha from 'react-recaptcha';
import {
  Form,
  Input,
  Checkbox,
	Button,
	message
} from 'antd';
@connect(
	state => ({
		code:state.register.code
	}),
	{
		gotoRegister: cart => ({
			type:'register/gotoRegister',
			cart:cart
		}),
		register: payload =>({
			type:'register/register',
			payload:payload
		}),
		getCode:(payload,callback)=>({
			type:'register/getCode',
			payload,
			callback
		}),
		loading:(isShow)=>({
			type:'common/loading',
			isShow
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

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
	};
	
	handleConfirmBlur = e => {
		const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};
	
	handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
				console.log('Received values of form: ', values);
				console.log(this.props)
				this.props.register(values);
      }
    });
	};
	getcode = e => {
		this.setState({
			showGoogleRecaptcha:true
		})
	}
	countDownFun(){
		const that = this;
		let countDownTime = that.state.countDownTime;
			that.setState({
				isStartSendCode:true
			})
		let codeInterval = setInterval(function(){
			if(countDownTime<0){
				clearInterval(codeInterval);
				that.setState({
					countDownTime:60,
					codeText:'获取验证码',
					isStartSendCode:false
				})
				return;
			}
			countDownTime--;
			that.setState({
				countDownTime:countDownTime,
				codeText:that.state.countDownTime+' S'
			})
		},1000);
	}
	closeGoogleRecaptchaMask = ()=>{
		this.setState({
			showGoogleRecaptcha:false
		})
	}
	recaptchaCallback =  () =>{
		console.log('Done!!!')
		this.props.loading(true);
	}
	recaptchaVerifyCallback =  (response)=>{
		console.log(response)
		let that = this;
		if(this.state.isStartSendCode){
			return;
		}
		if(response){
			this.setState({
				showGoogleRecaptcha:false
			})
		}
		const { form } = this.props;
		const email = form.getFieldValue('email');
		console.log(email);
		
		this.props.getCode({email,code:response},function(res){
			console.log(res)
			console.log('code success')
			that.countDownFun();
		});
	}

	componentDidMount(){
		
	}
	
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="register">
				<div className="title">注册</div>
				<Form className="panel" onSubmit={this.handleSubmit}>
					<Form.Item label="邮箱">
						{
							getFieldDecorator('email',{
								rules:[
									{
										type:'email',
										message:'请输入正确的邮箱'
									},
									{
										required:true,
										message:'邮箱必填'
									}
								],
								initialValue:''
							})(<Input size="large"/>)
						}
					</Form.Item>
					<Form.Item label="验证码" className="verifycode">
						{
							getFieldDecorator('verifycode',{
								rules:[
									{
										required:true,
										message:'验证码必填'
									}
								]
								// initialValue:{this.props.username}
							})(<Input size="large" suffix={<div className="verifycode-btn" onClick={this.getcode}>{this.state.codeText}</div>}/>)
						}
					</Form.Item>
					<Form.Item label="密码" className="password" hasFeedback>
						{
							getFieldDecorator('password',{
								rules:[
									{
										required:true,
										message:'密码必填'
									},
									{
										min:6,
										message:'密码最小长度6'
									},
									{
										max:20,
										message:'密码最大长度6'
									},
									{
										validator: this.validateToNextPassword,
									}
								]
							})(<Input.Password size="large"/>)
						}
					</Form.Item>
					<div>6-20位字符，同时包含字母和数字</div>
					<Form.Item label="确认密码" hasFeedback>
						{
							getFieldDecorator('confirm',{
								rules:[
									{
										required:true,
										message:'确认密码必填'
									},
									{
										validator: this.compareToFirstPassword,
									}
								]
							})(<Input.Password onBlur={this.handleConfirmBlur} size="large"/>)
						}
					</Form.Item>
					<Form.Item className="agreement">
						{getFieldDecorator('agreement', {
							valuePropName: 'checked',
							rules:[
								{
									required:true,
									message:'请勾选协议'
								}
							]
						})(
							<Checkbox>
								我已阅读并同意 《《<a href="" className="user-agreement-link">用户协议</a>》》
							</Checkbox>,
						)}
					</Form.Item>
					<Form.Item className="agreementcountry">
						{getFieldDecorator('agreementcountry', {
							valuePropName: 'checked',
							rules:[
								{
									required:true,
									message:'请勾选协议'
								}
							]
						})(
							<Checkbox>
								我的国籍不是美国、加拿大。我们无法为以上国籍提供服务，请确认您的国籍符合要求，感谢配合！
							</Checkbox>,
						)}
					</Form.Item>
					<Form.Item>
						<Button type="primary" size="large" className="registerbtn" block htmlType="submit">
							注册
						</Button>
					</Form.Item>
				</Form>

				 {this.state.showGoogleRecaptcha?<div className="google-recaptcha" style={{display:this.state.showGoogleRecaptcha?'':'none'}}>
					<Recaptcha
						sitekey="6LctH7MUAAAAANtQ4tivLA_wxzen0f8-P6juBNHC"
						verifyCallback={this.recaptchaVerifyCallback}
						onloadCallback={this.recaptchaCallback}
					/>
				</div>:<div></div>}
				
				<div className="google-recaptcha-mask" style={{display:this.state.showGoogleRecaptcha?'':'none'}} onClick={this.closeGoogleRecaptchaMask}></div>
			</div>
		)
	}
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm