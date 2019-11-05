import React from 'react';
// import './index.scss';
import {connect} from 'dva';
import router from 'umi/router';
import {
  PageHeader ,
  Table,
  Icon,
	Button,
  Popconfirm,
  Tag,
  Modal,
  Select,
  Form,
  Input
} from 'antd';
const { Option } = Select;
import {ShowMenuFilter} from '../../filter';

const CollectionCreateForm = Form.create({ name: 'update-pw-form-modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('您输入的两个密码不一致！');
      } else {
        callback();
      }
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="修改密码"
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
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
                })(<Input.Password  size="large"/>)
              }
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

@connect(
	state => ({
    userDataList:state.user.userDataList,
    roleDataList:state.role.roleList
	}),
	{
		userList: () => ({
			type:'user/userList'
    }),
    roleList: () => ({
			type:'role/roleList'
		}),
    disUserRole: (payload,callback) => ({
      type:'user/disUserRole',
      payload,
      callback
		}),
    userSyncListFunc: (payload) => ({
      type:'user/userSyncListFunc',
      payload
		}),
    updatePassword: (payload) => ({
      type:'user/updatePassword',
      payload
		})
	}
)
export default class extends React.Component {
	constructor(props){
		super(props);
		this.state = {
      columns: [
        {
          title:'',
          dataIndex: 'id'
        },
        {
          title: '账户',
          dataIndex: 'email'
        },
        {
          title: '昵称',
          dataIndex: 'nickname'
        },
        {
          title: '角色',
          dataIndex: 'role',
          render:(text,record,index)=><div>
            {record.type==1?(<Tag key='cg'>
                超级管理员
              </Tag>):record.roleList.map(ele=>{
              return (<Tag key={ele.id}>
                {ele.name}
              </Tag>)
            })}
          </div>
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render:(text, record, index)=> <div>
            {record.type==2?<div>
              {ShowMenuFilter('/user/addUserRole')?<Icon type="disconnect" className="edit-icon" title="分配角色" onClick={()=>this.handleDisRole(record)}/>:''}
              {ShowMenuFilter('/user/updatePassword')?<Icon type="key" className="edit-icon" title="修改密码" onClick={()=>this.handleUpdatwPw(record)}/>:''}
              {/* <Icon type="edit" className="edit-icon" title="修改账户" onClick={()=>this.handleEdit(record.id)}/>
              
              {ShowMenuFilter('/user/delete')?<Popconfirm title="确定要删除该账户嘛?" cancelText="取消" okText="确定" onConfirm={() => this.handleDelete(record.key)}>
                <Icon type="delete" title="删除账户" className="delete-icon"/>
              </Popconfirm>:''} */}
            </div>:''}
          </div>
        },
      ],
      visible:false,
      defaultRole:[],
      selectValueList:[],
      user_id:'',
      pwvisible:false
    }
  }
  componentWillReceiveProps(newProps){
    
  }
  componentWillUpdate(){

  }
  
  handleDisRole(record){
    let defaultRole = [];
    if(record.roleList){
      defaultRole = record.roleList.map(ele=>{
        return ele.id+'';
      })
    }
    console.log(this.props.roleDataList)
    if(this.props.roleDataList.length == 0){
      this.props.roleList();
    }
    this.setState({
      selectValueList:[...defaultRole],
      visible:true,
      defaultRole,
      user_id:record.id
    })
    
  }
  handleOk=e=>{
    let that = this;
    that.props.disUserRole({
      id:that.state.user_id,
      roleIds:JSON.stringify(that.state.selectValueList)
    },function(){
      that.props.userDataList.forEach(ele=>{
        if(ele.id == that.state.user_id){
          ele.roleList = [];
          that.state.selectValueList.forEach(selectId=>{
            that.props.roleDataList.forEach(role=>{
              if(selectId == role.id){
                ele.roleList.push({
                  id:role.id,
                  name:role.name
                })
              }
            })
          })
          
        }
      })
      that.props.userSyncListFunc([...that.props.userDataList]);
    })
    that.setState({
      visible:false
    })
  }

  handleCancel=e=>{
    this.setState({
      visible:false
    })
  }

  handleChange=value=>{
    this.setState({
      selectValueList:value
    })
  }
  
	componentDidMount(){
		this.props.userList();
  }
  
  handleAddRole(e){
    router.push('/crm/user/add')
  }
  
  handleEdit(id){
    router.push('/crm/role/'+id);
  }
  handleDelete(index){
    console.log(index)
  }

  handlePwOk=e=>{
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      this.props.updatePassword({
        id:this.state.user_id,
        password:values.password
      })
      form.resetFields();
      this.setState({ pwvisible: false });
    });
  }

  handlePwCancel=e=>{
    this.setState({
      pwvisible:false
    })
  }
  handleUpdatwPw(record){
    console.log(record)
    // this.setState({
    //   selectValueList:[...defaultRole],
    //   visible:true,
    //   defaultRole,
    //   user_id:record.id
    // })
    this.setState({
      pwvisible:true,
      user_id:record.id
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
	render() {
    const {columns,data} = this.state;
		
		return (
			<div className="role-page">
        <PageHeader title="账户列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/user/add')?<Button type="primary" onClick={this.handleAddRole}>添加账户</Button>:''}
        </div>
        <Table rowKey={record=>record.id} className="data-list" columns={columns} dataSource={this.props.userDataList} />
        <Modal
          title="分配角色"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          {this.state.visible?<Select mode="tags" size="large" defaultValue={this.state.defaultRole} loading={this.props.roleDataList.length == 0} style={{ width: '100%' }} placeholder="请选择角色" onChange={this.handleChange}>
            {this.props.roleDataList.map((ele,inx)=>{
              return <Option key={ele.id}>{ele.name}</Option>
            })}
          </Select>:''}
        </Modal>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.pwvisible}
          onCancel={this.handlePwCancel}
          onCreate={this.handlePwOk}
        />
			</div>
		)
	}
}