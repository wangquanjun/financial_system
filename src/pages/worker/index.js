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
import {ShowMenuFilter,majorIdFilter,ageFilter} from '../../filter';
@connect(
	state => ({
		workerListData:state.worker.workerList,
		workerCount:state.worker.workerCount,
		majorList:state.worker.majorList
	}),
	{
		workerListFunc: (payload) => ({
      type:'worker/workerListFunc',
      payload
    }),
    deleteById : (id,index) => ({
      type:'worker/deleteById',
      id,
      index
    }),
    updateWorkerList:(list)=>({
      type:'worker/updateWorkerList',
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
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '职业',
          dataIndex: 'major_id',
          render:(text, record, index)=><div>{majorIdFilter(text,this.props.majorList)}</div>
        },
        {
          title: '年龄',
          dataIndex: 'birth_time',
          render:(text, record, index)=><div>{ageFilter(text)}</div>
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
      ],
      pageSize:10,
      pageNumber:1
    }
	}

	componentDidMount(){
		this.props.workerListFunc();
  }
  
  handleAddWorker(e){
    router.push('/crm/worker/add')
  }
  
  handleEdit(id){
    router.push('/crm/worker/'+id);
  }
  handleDelete(item,index){
    let that = this;
    that.props.deleteById(item.id,index);
  }
	render() {
    const {columns,data} = this.state;
		
		return (
			<div className="role-page">
        <PageHeader title="工人列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/role/add')?<Button type="primary" onClick={this.handleAddWorker}>添加角色</Button>:''}
        </div>
        <Table rowKey={record=>record.id} pagination={{total:this.props.workerCount,pageSize:this.state.pageSize}} className="data-list" columns={columns} dataSource={this.props.workerListData} />
			</div>
		)
	}
}