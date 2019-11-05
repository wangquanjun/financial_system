import React from 'react';
import './index.scss';
import {connect} from 'dva';
import router from 'umi/router';
import {
  PageHeader ,
  Table,
  Icon,
	Button,
  Popconfirm,
  Form,
  Modal,
  Input,
  Switch
} from 'antd';
import {ShowMenuFilter} from '../../filter';

const AddStockForm = Form.create({ name: 'update-pw-form-modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form,code,name } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新增职员"
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="编码" className="password">
              {
                getFieldDecorator('code',{
                  rules:[
                    {
                      required:true,
                      message:'编码必填'
                    }
                  ],
                  initialValue:code
                })(<Input size="large"/>)
              }
            </Form.Item>
            <Form.Item label="名称">
              {
                getFieldDecorator('name',{
                  rules:[
                    {
                      required:true,
                      message:'名称必填'
                    }
                  ],
                  initialValue:name
                })(<Input size="large"/>)
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
		listData:state.auxiliary.listData,
		count:state.auxiliary.count
	}),
	{
		listStock: (au_type) => ({
      type:'auxiliary/list',
      au_type
    }),
    addStock: (payload) => ({
      type:'auxiliary/add',
      payload
    }),
    deleteById : (id,index) => ({
      type:'auxiliary/deleteById',
      id,
      index
    }),
    updateStock:(payload)=>({
      type:'auxiliary/update',
      payload
    }),
    updateStockStatus:(payload)=>({
      type:'auxiliary/updateStatus',
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
          title:'编码',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          render:(text, record, index)=>{
            return <Switch defaultChecked checked={record.status==1} onChange={()=>this.onSwitchChange(record)} />
          }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render:(text, record, index)=> <div>
            {ShowMenuFilter('/role/updateById')?<Icon type="edit" className="edit-icon" onClick={()=>this.handleEdit(record)}/>:''}
            
            {ShowMenuFilter('/role/delete')?<Popconfirm title="确定要删除嘛?" cancelText="取消" okText="确定" onConfirm={() => this.handleDelete(record,index)}>
              <Icon type="delete" className="delete-icon"/>
            </Popconfirm>:''}
            </div>
        },
      ],
      pageSize:50,
      selectedRowKeys: [],
      addVisible:false,
      code:'',
      name:'',
      id:''
    }
	}
  handleAddStock=e=>{
    this.setState({
      id:'',
      code:'',
      name:'',
      addVisible:true
    })
  }
	componentDidMount(){
		this.props.listStock(6);
  }
  
  handleEdit(item){
    this.setState({
      id:item.id,
      code:item.code,
      name:item.name,
      addVisible:true
    })
  }
  onSwitchChange(item){
    console.log(item)
    var values = {
      id:item.id,
      status:item.status==1?2:1
    }
    this.props.updateStockStatus(values);
  }
  handleDelete(item,index){
    this.props.deleteById(item.id,index)
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  handleAddCancel=e=>{
    this.setState({
      addVisible:false
    })
  }
  handleAddOk=e=>{
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      values.type = 6;
      if(this.state.id){
        values.id = this.state.id;
        this.props.updateStock(values);
      }else{
        this.props.addStock(values);
      }
      form.resetFields();
      this.setState({ addVisible: false });
    });
  }
	render() {
    const {columns,selectedRowKeys } = this.state;
		const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
		return (
			<div className="role-page">
        <PageHeader title="职员列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/role/add')?<Button type="primary" onClick={this.handleAddStock}>添加职员</Button>:''}
        </div>
        <Table rowKey={record=>record.id} rowSelection={rowSelection}  pagination={{total:this.props.count,pageSize:this.state.pageSize}} className="data-list" columns={columns} dataSource={this.props.listData} />
        <AddStockForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.addVisible}
          onCancel={this.handleAddCancel}
          onCreate={this.handleAddOk}
          code={this.state.code}
          name={this.state.name}
        />
			</div>
		)
	}
}