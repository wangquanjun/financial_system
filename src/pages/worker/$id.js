import React from 'react';
import './index.scss';
import {connect} from 'dva';
import {
  PageHeader ,
  Input,
  Icon,
	Button,
  Form,
  Checkbox,
  Row,
  Upload,
  Radio,
  DatePicker,
  Select
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
// var uuid = require('react-native-uuid');
import uuid from 'react-native-uuid';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
@connect(
	state => ({
    provinceListData:state.worker.provinceList,
    cityListData:state.worker.cityList,
    cityDefaultValue:state.worker.cityDefaultValue,
    countyListData:state.worker.countyList,
    countyDefaultValue:state.worker.countyDefaultValue,
    listMajorData:state.worker.listMajorData,
    workerDetail:state.worker.workerDetail,
	}),
	{
    queryDetailById: workerId => ({
      type:'worker/queryDetailById',
      workerId
    }),
    cityList: tagId => ({
      type:'worker/cityListFunc',
      tagId
    }),
    countyList: tagId => ({
      type:'worker/countyListFunc',
      tagId
    }),
    addWorker: payload => ({
      type:'worker/addWorker',
      payload
    }),
    updateWorker: payload => ({
      type:'worker/updateWorker',
      payload
    })
	}
)

class WorkerInfoForm extends React.Component {
	constructor(props){
    super(props);
    console.log(props.match.params.id)
		this.state = {
      permissionMenuDataList:[],
      workerType:props.match.params.id == 'add'?'add':'update',
      workerId:props.match.params.id,
      roleName:'',
      token:localStorage.getItem('token'),
      qm_uuid:uuid.v1()
    }
	}

	componentDidMount(){
    this.props.queryDetailById(this.state.workerType == 'update'?this.state.workerId:'');
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        var newDate = new Date(values.birth_time._d);
        values.birth_time = "" + newDate.getTime();
        if(this.state.workerType == 'update'){
          values.id = this.state.workerId;
          this.props.updateWorker(values);
        }else{
          this.props.addWorker(values);
        }
        
      }
    });
  }
  provinceChange = value => {
    console.log(value)
    this.props.cityList(value);
  }
  cityChange = value => {
    this.props.countyList(value);
  }
  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    e.fileList.forEach(item=>{
      if(!item.url && item.response){
        item.name = item.response.data.url
        item.url = 'http://vip.mfcdong.com/'+item.name
      }
    })
    return e && e.fileList;
  };
  uploadImage = info =>{
  }
	render() {
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const {roleName} = this.state;
    const config = {
      rules: [{required: true, message: '请选择出生年月日' }],
      initialValue:this.props.workerDetail.birth_time?moment(moment(+this.props.workerDetail.birth_time).format('YYYY-MM-DD')):null
    };
		return (
			<div className="role-page">
        <PageHeader title="工人信息添加"/>
        <Form layout="inline" onSubmit={this.handleSubmit} className="worker-add">
          <div className="group-item">
            <Form.Item label="申请职位">
              {getFieldDecorator('major_id',{
                rules: [
                  {
                    required: true,
                    message: '请选择职位'
                  }
                ],
                initialValue:this.props.workerDetail.major_id
              })(
                <Select style={{ width: 194 }} placeholder="请选择职位">
                  {this.props.listMajorData.map(ele=>{
                    return (<Option key={ele.id} value={ele.id}>{ele.name}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>
            
          </div>
          <div className="group-item">
            <Form.Item label="姓名" className="group-box">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名'
                  }
                ],
                initialValue:this.props.workerDetail.name
              })(
                <Input
                  layout = "vertical"
                  placeholder="姓名"
                />,
              )}
            </Form.Item>
            <Form.Item label="性别" className="group-box">
              {getFieldDecorator('sex',{
                rules: [
                  {
                    required: true,
                    message: '请选择性别'
                  }
                ],
                initialValue:this.props.workerDetail.sex+''
              })(
                <Radio.Group>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="民族" className="group-box">
              {getFieldDecorator('nation',{
                rules: [
                  {
                    required: true,
                    message: '请填写民族'
                  }
                ],
                initialValue:this.props.workerDetail.nation
              })(
                <Input
                  layout = "vertical"
                  placeholder="民族"
                />,
              )}
            </Form.Item>
          </div>
          <div className="group-item">
            <Form.Item label="出生日期" className="group-box">
              {getFieldDecorator('birth_time', config)(<DatePicker locale={locale}/>)}
            </Form.Item>
            <Form.Item label="身高" className="group-box">
              {getFieldDecorator('wk_height',{
                rules: [
                  {
                    required: true,
                    message: '请填写民族'
                  }
                ],
                initialValue:this.props.workerDetail.wk_height
              })(
                <Input
                  layout = "vertical"
                  placeholder="身高"
                />,
              )}
            </Form.Item>
            <Form.Item label="体重" className="group-box">
              {getFieldDecorator('wk_weight',{
                initialValue:this.props.workerDetail.wk_weight
              })(
                <Input
                  layout = "vertical"
                  placeholder="体重"
                />,
              )}
            </Form.Item>
          </div>
          <div className="group-item">
            <Form.Item label="文化程度" className="group-box">
              {getFieldDecorator('culture',{
                rules: [
                  {
                    required: true,
                    message: '请选择文化程度'
                  }
                ],
                initialValue:this.props.workerDetail.culture
              })(
                <Select style={{ width: 194 }} placeholder="选择文化程度">
                  <Option value="1">小学</Option>
                  <Option value="2">初中</Option>
                  <Option value="3">
                    中专
                  </Option>
                  <Option value="4">专科</Option>
                  <Option value="5">本科</Option>
                  <Option value="6">研究生</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="婚姻" className="group-box">
              {getFieldDecorator('marriage',{
                rules: [
                  {
                    required: true,
                    message: '请选择婚姻状态'
                  }
                ],
                initialValue:this.props.workerDetail.marriage+''
              })(
                <Radio.Group>
                  <Radio value="1">单身</Radio>
                  <Radio value="2">未婚</Radio>
                  <Radio value="3">已婚</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            
            <Form.Item className="group-box">
              
            </Form.Item>
          </div>
          
          <div className="group-item">
            <Form.Item label="身份证号" className="group-box">
              {getFieldDecorator('ID_number', {
                rules: [
                  {
                    required: true,
                    message: '请输入身份证号'
                  }
                ],
                initialValue:this.props.workerDetail.ID_number
              })(
                <Input
                  layout = "vertical"
                  placeholder="身份证号"
                  style={{ width: 420 }}
                />,
              )}
            </Form.Item>
            
          </div>
          <div className="group-item">
            <Form.Item label="护照号" className="group-box">
              {getFieldDecorator('passport_nummber', {
                rules: [],
                initialValue:this.props.workerDetail.passport_nummber
              })(
                <Input
                  layout = "vertical"
                  placeholder="护照号"
                  style={{ width: 420 }}
                />,
              )}
            </Form.Item>
            
          </div>
          
          <div className="group-item">
            <Form.Item label="家庭住址">
              {getFieldDecorator('province_id',{
                rules: [
                  {
                    required: true,
                    message: '请选择省'
                  }
                ],
                initialValue:this.props.workerDetail.province_id
              })(
                <Select style={{ width: 194 }} placeholder="选择省" onChange={this.provinceChange}>
                  {this.props.provinceListData.map(ele=>{
                    return (<Option key={ele.id} value={ele.tag}>{ele.name}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>
            {getFieldValue('province_id')?<Form.Item>
              {getFieldDecorator('city_id',{
                rules: [
                  {
                    required: true,
                    message: '请选择市'
                  }
                ],
                initialValue:this.props.workerDetail.city_id || this.props.cityDefaultValue
              })(
                <Select style={{ width: 194 }} placeholder="选择市" onChange={this.cityChange}>
                  {this.props.cityListData.map(ele=>{
                    return (<Option key={ele.id} value={ele.tag}>{ele.name}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>:''}
            {getFieldValue('city_id')?<Form.Item>
              {getFieldDecorator('county_id',{
                rules: [
                  {
                    required: true,
                    message: '请选择县'
                  }
                ],
                initialValue:this.props.workerDetail.county_id || this.props.countyDefaultValue
              })(
                <Select style={{ width: 194 }} placeholder="选择县">
                  {this.props.countyListData.map(ele=>{
                    return (<Option key={ele.id} value={ele.tag}>{ele.name}</Option>)
                  })}
                </Select>
              )}
            </Form.Item>:''}
            
          </div>
          <div className="group-item">
            <Form.Item>
              {getFieldDecorator('address_info',{
                rules: [
                  {
                    required: true,
                    message: '请填写详细地址'
                  }
                ],
                initialValue:this.props.workerDetail.address_info
              })(
                <TextArea
                  placeholder="详细地址"
                  className="custom"
                  style={{ height: 50,width: 500 }}
                />
              )}
            </Form.Item>
          </div>
          <div className="group-item">
            <Form.Item label="上传图片信息">
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload name="file" onChange={this.uploadImage} data={{token:this.state.token,uuid:this.state.qm_uuid}} action="/api/upload/file" listType="picture">
                  <Button>
                    <Icon type="upload" />支持单次或批量上传。
                  </Button>
                </Upload>,
              )}
            </Form.Item>
          </div>
          <div className="group-item">
            <Form.Item label="手机号" className="group-box">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号'
                  }
                ],
                initialValue:this.props.workerDetail.phone
              })(
                <Input
                  layout = "vertical"
                  placeholder="手机号"
                />,
              )}
            </Form.Item>
            <Form.Item label="邮箱" className="group-box">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '邮箱格式错误！',
                  }
                ],
                initialValue:this.props.workerDetail.email
              })(
                <Input
                  layout = "vertical"
                  placeholder="邮箱"
                />,
              )}
            </Form.Item>
            <Form.Item label="出国经历" className="group-box">
              {getFieldDecorator('go_abroad', {
                rules: [],
                initialValue:this.props.workerDetail.go_abroad
              })(
                <Input
                  layout = "vertical"
                  placeholder="出国经历"
                />,
              )}
            </Form.Item>
          </div>
            
            
          <Form.Item>
          
            <Button type="primary" htmlType="submit" className="login-form-button">
              保存
            </Button>
          
          </Form.Item>
        </Form>
			</div>
		)
	}
}


const WrappedNormalWorkerForm = Form.create({ name: 'normal_worker' })(WorkerInfoForm);

export default WrappedNormalWorkerForm;