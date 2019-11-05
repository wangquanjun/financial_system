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
  Radio
} from 'antd';
import {ShowMenuFilter} from '../../filter';
/**
 * 凭证字
 */
const AddStockForm = Form.create({ name: 'update-pw-form-modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form,title,print_title,isDefault } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新增凭证字"
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="凭证字" className="password">
              {
                getFieldDecorator('title',{
                  rules:[
                    {
                      required:true,
                      message:'凭证字必填'
                    }
                  ],
                  initialValue:title
                })(<Input size="large"/>)
              }
            </Form.Item>
            <Form.Item label="打印标题">
              {
                getFieldDecorator('print_title',{
                  rules:[
                    {
                      required:true,
                      message:'打印标题必填'
                    }
                  ],
                  initialValue:print_title
                })(<Input size="large"/>)
              }
            </Form.Item>
            <Form.Item label="是否默认">
              {getFieldDecorator('isDefault',{
                initialValue:isDefault+''
              })(
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="2">否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

@connect(
	state => ({
		listData:state.voucher_word.listData,
		count:state.voucher_word.count
	}),
	{
		list: () => ({
      type:'voucher_word/list'
    }),
    addStock: (payload) => ({
      type:'voucher_word/add',
      payload
    }),
    deleteById : (id,index) => ({
      type:'voucher_word/deleteById',
      id,
      index
    }),
    updateStock:(payload)=>({
      type:'voucher_word/update',
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
          title:'序号',
          dataIndex: 'id'
        },
        {
          title:'凭证字',
          dataIndex: 'title'
        },
        {
          title: '打印标题',
          dataIndex: 'print_title'
        },
        {
          title: '是否默认',
          dataIndex: 'isDefault',
          render:(text, record, index)=>{
            return <div>{text==1?'是':'否'}</div>
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
      title:'',
      isDefault:'',
      print_title:'',
      id:''
    }
	}
  handleAddStock=e=>{
    this.setState({
      id:'',
      title:'',
      print_title:'',
      isDefault:'',
      addVisible:true
    })
  }
	componentDidMount(){
		this.props.list(2);
  }
  
  handleEdit(item){
    this.setState({
      id:item.id,
      title:item.title,
      print_title:item.print_title,
      isDefault:item.isDefault || 2,
      addVisible:true
    })
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
        <PageHeader title="凭证字列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/role/add')?<Button type="primary" onClick={this.handleAddStock}>添加凭证字</Button>:''}
        </div>
        <Table rowKey={record=>record.id}  pagination={{total:this.props.count,pageSize:this.state.pageSize}} className="data-list" columns={columns} dataSource={this.props.listData} />
        <AddStockForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.addVisible}
          onCancel={this.handleAddCancel}
          onCreate={this.handleAddOk}
          title={this.state.title}
          print_title={this.state.print_title}
          isDefault={this.state.isDefault}
        />
			</div>
		)
	}
}