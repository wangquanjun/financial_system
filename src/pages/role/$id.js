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
  Col
} from 'antd';
@connect(
	state => ({
    permissionMenuDataList:state.role.permissionMenuDataList
	}),
	{
    permissionMenuList: callback => ({
      type:'role/permissionMenuList',
      callback
    }),
    initMenuData: (payload) => ({
      type:'role/initMenuData',
      payload
		}),
    addRole: (payload) => ({
      type:'role/addRole',
      payload
    }),
    updateRole: (payload) => ({
      type:'role/updateRole',
      payload
    }),
    queryById: (id,callback) => ({
      type:'role/queryById',
      id,
      callback
    }),
    updateLoading: isLoading => ({
      type:'crm/effectSetLoading',
      isLoading
    }),
	}
)

class RoleInfoForm extends React.Component {
	constructor(props){
    super(props);
    console.log(props.match.params.id)
		this.state = {
      permissionMenuDataList:[],
      roleType:props.match.params.id == 'add'?'add':'update',
      roleId:props.match.params.id,
      roleName:''
    }
	}

	componentDidMount(){
    let that = this;
    that.props.updateLoading(true);
    this.props.permissionMenuList(function(list){
      if(that.state.roleType == 'update'){
        that.props.queryById(that.state.roleId,function(data,err){
          that.props.updateLoading(false);
          if(err){
            return
          }
          that.initUpdateMenu(list,data)
          
        })
      }else{
        that.setState({
          permissionMenuDataList:list
        })
        that.props.updateLoading(false);
      }
    });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        var ids = [];
        this.state.permissionMenuDataList.forEach(b=>{
          b.list.forEach(item=>{
            if(item.checked){
              ids.push(item.id)
            }
            
          })
        })
        values.ids = JSON.stringify(ids);
        if(this.state.roleType == 'update'){
          values.id = this.state.roleId;
          this.props.updateRole(values);
        }else{
          this.props.addRole(values);
        }
        
      }
    });
  }

  initUpdateMenu = (permissionList,data)=>{
    permissionList.forEach(e => {
      let iLength = 0;
      e.list.forEach(item=>{
        data.list.forEach(ads=>{
          if(item.id == ads){
            item.checked = true;
            item.indeterminate = false;
            iLength++;
          }
        })
        
      })
      let isTue = iLength == e.list.length;
      e.indeterminate = !isTue && iLength>0;
      e.checkAll = isTue;
    });
    this.setState({
      permissionMenuDataList:permissionList,
      roleName:data.name
    });
  }

  onChange = (menuId,itemId) => {
    this.state.permissionMenuDataList.forEach(e => {
      if(e.id == menuId){
        let iLength = 0;
        e.list.forEach(item=>{
          if(item.id == itemId){
            item.checked = !item.checked;
            item.indeterminate = false;
          }
          if(item.checked){
            iLength++;
          }
        })
        let isTue = iLength == e.list.length;
        e.indeterminate = !isTue && iLength>0;
        e.checkAll = isTue;
      }
    });
    this.setState({
      permissionMenuDataList:this.state.permissionMenuDataList
    });
  };
  onCheckAllChange = menuId => {
    this.state.permissionMenuDataList.forEach(e => {
      if(e.id == menuId){
        e.indeterminate = false;
        e.checkAll = !e.checkAll;
        e.list.forEach(item=>{
          item.checked = e.checkAll
        })
      }
    });
    this.setState({
      permissionMenuDataList:this.state.permissionMenuDataList
    })
  };
	render() {
    const { getFieldDecorator } = this.props.form;
    const {roleName} = this.state;
    
		return (
			<div className="role-page">
        <PageHeader title="角色添加"/>
        <Form onSubmit={this.handleSubmit} className="role-name">
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入角色名称',
                  },
                ],
                initialValue:roleName
              })(
                <Input
                  layout = "vertical"
                  placeholder="角色名称"
                />,
              )}
            </Form.Item>
            
            {this.state.permissionMenuDataList.map((menu,index) => {
              return <div key={index}>
                <Checkbox
                  indeterminate={menu.indeterminate}
                  onChange={()=>this.onCheckAllChange(menu.id)}
                  checked={menu.checkAll}
                >
                  {menu.name}
                </Checkbox>
                <Form.Item>
                  {menu.list.map((item,iIndex)=>{
                    return <Checkbox
                    indeterminate={item.indeterminate}
                    onChange={()=>this.onChange(menu.id,item.id)}
                    checked={item.checked}
                    key={iIndex}
                  >
                    {item.title}
                  </Checkbox>
                  })}
                </Form.Item>
              </div>
            })}
            
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


const WrappedNormalRoleForm = Form.create({ name: 'normal_role' })(RoleInfoForm);

export default WrappedNormalRoleForm;