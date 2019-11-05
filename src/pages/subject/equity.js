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
  Switch,
  Select,
  Radio,
  Checkbox,
  Row,
  Col,
  message
} from 'antd';
import {ShowMenuFilter} from '../../filter';
import {auxiliaryFilter,directionFilter,categoryEquityFilter} from './subjectFilter';
const { Option } = Select;
const AddStockForm = Form.create({ name: 'update-pw-form-modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form,code,name,category,parentName,direction,auxiliary,auxiliaryTypes,numberUnit } = this.props;
      const { getFieldDecorator,getFieldValue } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      };
      console.log(auxiliary)
      return (
        <Modal
          visible={visible}
          title="新增权益类科目"
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout}>
            <Form.Item label="科目编码" className="password">
              {
                getFieldDecorator('code',{
                  rules:[
                    {
                      required:true,
                      message:'科目编码编码必填'
                    }
                  ],
                  initialValue:code
                })(<Input size="large"/>)
              }
            </Form.Item>
            <Form.Item label="科目名称">
              {
                getFieldDecorator('name',{
                  rules:[
                    {
                      required:true,
                      message:'科目名称必填'
                    }
                  ],
                  initialValue:name
                })(<Input size="large"/>)
              }
            </Form.Item>
            <Form.Item label="上级科目">
              {
                getFieldDecorator('parent_name',{
                  rules:[],
                  initialValue:parentName
                })(<Input size="large" disabled={true}/>)
              }
            </Form.Item>
            <Form.Item label="科目类别">
              {getFieldDecorator('category',{
                initialValue:category+""
              })(
                <Select>
                  <Option key="1" value="1">所有者权益</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="余额方向">
              {getFieldDecorator('direction',{
                 initialValue:direction+""
              })(
                <Radio.Group>
                  <Radio value="1">借</Radio>
                  <Radio value="2">贷</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="辅助核算" className="subject-auxiliary">
              {getFieldDecorator('auxiliary', {
                valuePropName: 'checked',
                initialValue:auxiliary
              })(
                <Checkbox></Checkbox>
              )}
            </Form.Item>
            {getFieldValue('auxiliary')?<Form.Item>
              {getFieldDecorator('auxiliaryList', {
                rules:[
                  {
                    required:true,
                    message:'请选择辅助核算'
                  }
                ],
                initialValue:auxiliaryTypes
              })(
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={6}>
                      <Checkbox value={1}>客户</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value={2}>
                        存货
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value={3}>供应商</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value={4}>部门</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value={5}>项目</Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value={6}>职员</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>,
              )}
            </Form.Item>:''}
            <Form.Item label="数量核算" className="subject-auxiliary">
              {getFieldDecorator('number-auxiliary', {
                valuePropName: 'checked',
                initialValue:numberUnit?true:false
              })(
                <Checkbox></Checkbox>
              )}
            </Form.Item>
            {getFieldValue('number-auxiliary')?<Form.Item>
              {getFieldDecorator('checkbox-group', {
                // initialValue: ['A', 'B'],
              })(
                <Form.Item label="计量单位">
                  {
                    getFieldDecorator('number_unit',{
                      rules:[
                        {
                          required:true,
                          message:'名称必填'
                        }
                      ],
                      initialValue:numberUnit
                    })(<Input size="large"/>)
                  }
                </Form.Item>
              )}
            </Form.Item>:''}
          </Form>
        </Modal>
      );
    }
  },
);

@connect(
	state => ({
		listData:state.subject.listData,
		count:state.subject.count
	}),
	{
		list: (au_type) => ({
      type:'subject/list',
      au_type
    }),
    addStock: (payload) => ({
      type:'subject/add',
      payload
    }),
    deleteById : (id,index) => ({
      type:'subject/deleteById',
      id,
      index
    }),
    updateStock:(payload)=>({
      type:'subject/update',
      payload
    }),
    updateStockStatus:(payload)=>({
      type:'subject/updateStatus',
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
          dataIndex: 'name',
          render:(text, record, index)=>{
            return <div className={'layer'+record.layer}>{text}</div>
          }
        },
        {
          title: '类别',
          dataIndex: 'category',
          render:(text, record, index)=>{
            return <div>{categoryEquityFilter(text)}</div>
          }
        },
        {
          title: '余额方向',
          dataIndex: 'direction',
          render:(text, record, index)=>{
            return <div>{directionFilter(text)}</div>
          }
        },
        {
          title: '辅助核算',
          dataIndex: 'auxiliaryTypes',
          render:(text, record, index)=>{
            return <div>{auxiliaryFilter(text)}</div>
          }
        },
        {
          title: '数量',
          dataIndex: 'number_unit'
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
            {ShowMenuFilter('/role/updateById')?<Icon type="plus" className="edit-icon" onClick={()=>this.handleAddChildrenStock(record)}/>:''}
            {ShowMenuFilter('/role/updateById')?<Icon type="edit" className="edit-icon" onClick={()=>this.handleEdit(record)}/>:''}
            
            {ShowMenuFilter('/role/delete')?<Popconfirm title="确定要删除嘛?" cancelText="取消" okText="确定" onConfirm={() => this.handleDelete(record,index)}>
              <Icon type="delete" className="delete-icon"/>
            </Popconfirm>:''}
            </div>
        },
      ],
      pageSize:150,
      selectedRowKeys: [],
      addVisible:false,
      code:'',
      name:'',
      id:'',
      parent_id:'',
      parentName:'',
      category:"1",
      direction:"1",
      auxiliary:false,
      auxiliaryTypes:[],
    }
	}
  handleAddStock=e=>{
    this.setState({
      id:'',
      code:'',
      name:'',
      parent_id:'',
      parentName:'无上级科目',
      category:"1",
      direction:"1",
      auxiliary:false,
      auxiliaryTypes:[],
      addVisible:true
    })
  }
  handleAddChildrenStock=item=>{
    console.log(item)
    if(item.layer>=4){
      message.warning('最大层级为4层')
      return;
    }
    this.setState({
      id:'',
      code:'',
      name:'',
      parent_id: item.id,
      parentName: item.code+' '+item.name,
      category:"1",
      direction:"1",
      auxiliary:false,
      auxiliaryTypes:[],
      addVisible:true
    })
  }
	componentDidMount(){
		this.props.list(3);
  }
  
  handleEdit(item){
    this.setState({
      id:item.id,
      code:item.code,
      name:item.name,
      parent_id:item.parent_id,
      parentName:'无上级科目',
      category:item.category,
      direction:item.direction,
      auxiliary:item.auxiliaryTypes.length>0,
      auxiliaryTypes:item.auxiliaryTypes,
      number_unit:item.number_unit,
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
      console.log('Received values of form: ', values);
      if (err) {
        return;
      }

      
      values.type = 3;
      values.parent_id = this.state.parent_id;
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
			<div className="role-page assets-page">
        <PageHeader title="权益类列表"/>
        <div className="header-operation">
          {ShowMenuFilter('/role/add')?<Button type="primary" onClick={this.handleAddStock}>新增</Button>:''}
        </div>
        <Table defaultExpandAllRows={true} rowKey={record=>record.id} rowSelection={rowSelection}  pagination={{total:this.props.count,pageSize:this.state.pageSize}} className="data-list" columns={columns} dataSource={this.props.listData} />
        <AddStockForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.addVisible}
          onCancel={this.handleAddCancel}
          onCreate={this.handleAddOk}
          code={this.state.code}
          name={this.state.name}
          parentName={this.state.parentName}
          category={this.state.category}
          direction={this.state.direction}
          auxiliary={this.state.auxiliary}
          auxiliaryTypes={this.state.auxiliaryTypes}
          numberUnit={this.state.number_unit}
        />
			</div>
		)
	}
}