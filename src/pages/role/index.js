import React from 'react';
import './index.scss';
import {connect} from 'dva';
import router from 'umi/router';
import {
  PageHeader ,
  Table,
  Icon,
	Button,
	Popconfirm
} from 'antd';
import {ShowMenuFilter} from '../../filter';
@connect(
	state => ({
		roleDataList:state.role.roleList
	}),
	{
		roleList: (callback) => ({
      type:'role/roleList',
      callback
    }),
    deleteById : (id,callback) => ({
      type:'role/deleteById',
      id,
      callback
    }),
    updateRoleList:(list)=>({
      type:'role/updateRoleList',
      list
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
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render:(text, record, index)=> <div>
            {ShowMenuFilter('/role/updateById')?<Icon type="edit" className="edit-icon" onClick={()=>this.handleEdit(record.id)}/>:''}
            
            {ShowMenuFilter('/role/delete')?<Popconfirm title="确定要删除嘛?" cancelText="取消" okText="确定" onConfirm={() => this.handleDelete(record,index)}>
              <Icon type="delete" className="delete-icon"/>
            </Popconfirm>:''}
            </div>
        },
      ]
    }
	}

	componentDidMount(){
		this.props.roleList();
  }
  
  handleAddRole(e){
    router.push('/crm/role/add')
  }
  
  handleEdit(id){
    router.push('/crm/role/'+id);
  }
  handleDelete(item,index){
    let that = this;
    that.props.deleteById(item.id,function(){
      that.props.roleDataList.splice(index,1);
      let arr = [...that.props.roleDataList];
      that.props.updateRoleList(arr);
    })
  }
	render() {
    const {columns,data} = this.state;
		
		return (
			<div className="role-page">
        <PageHeader title="角色列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/role/add')?<Button type="primary" onClick={this.handleAddRole}>添加角色</Button>:''}
        </div>
        <Table rowKey={record=>record.id} className="data-list" columns={columns} dataSource={this.props.roleDataList} />
			</div>
		)
	}
}