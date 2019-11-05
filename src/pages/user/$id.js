import React from 'react';
// import './register.scss';
import {connect} from 'dva';
import {
  Form,
  Input,
  Checkbox,
	Button,
	PageHeader
} from 'antd';
@connect(
	state => ({
		code:state.register.code
	}),
	{
		add: payload => ({
			type:'user/addUser',
			payload
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
			userType:props.match.params.id == 'add'?'add':'update',
      userId:props.match.params.id,
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
				this.props.add(values);
      }
    });
	};

	componentDidMount(){
		let that = this;
		if(that.state.userType == 'update'){

		}
	}
	
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<PageHeader title="账户添加"/>
				<Form className="user-add" onSubmit={this.handleSubmit}>
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
					<Form.Item label="昵称">
						{
							getFieldDecorator('nickname',{
								rules:[
									{
										required:true,
										message:'昵称必填'
									}
								],
								initialValue:''
							})(<Input size="large"/>)
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
					
					<Form.Item>
						<Button type="primary" size="large" className="registerbtn" block htmlType="submit">
							添加
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm