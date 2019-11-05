import { Form, Icon, Input, Button, Checkbox, Divider } from 'antd';
import React, { Component } from "react";
import  "./index.scss";

import { Login } from "ant-design-pro";
import { connect } from "dva";

@connect(
	state => ({
		smsCode:state.user.smsCode,
		smsId:state.user.smsId,
	}),
	{
		svgcode: () => ({
			type:'user/svgcode'
    }),
    login: payload => ({
      type:'user/login',
      payload
    }),
    updatesvgcode:id=>({
      type:'user/updatesvgcode',
      id
    })
	})
class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.smsId){
          values.captcha_id = this.props.smsId;
          this.props.login(values);
        }
      }
    });
  };

  componentDidMount(){
    this.props.svgcode();
  }

  updatesvgcode=()=>{
    console.log(this.props.smsId)
    this.props.updatesvgcode(this.props.smsId)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="register-page login-page">
        <div className="">
          <div className="login-title">
            管理员登陆
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: '邮箱格式错误！',
                },
                {
                  required: true,
                  message: '请输入邮箱',
                },
              ],
              })(
                <Input
                  layout = "vertical"
                  placeholder="账户"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input
                  layout = "vertical"
                  type="password"
                  placeholder="密码"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('captcha_code', {
                rules: [{ required: true, message: '请输出验证码' }],
              })(
                <Input
                  layout = "vertical"
                  placeholder="验证码"
                  prefix={<Icon type="safety-certificate" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={<div dangerouslySetInnerHTML={{ __html:this.props.smsCode}} onClick={this.updatesvgcode}></div>}
                />,
              )}
            </Form.Item>
            <Form.Item>
            
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            
            </Form.Item>
            {/* <Form.Item>
              <div className="login-form-left">还没有账户？<a href="">注册</a></div>
              <a className="login-form-forgot" href="">
                忘记密码
              </a>
            </Form.Item> */}
          </Form>
        </div>
      </div>
       
    
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm;
