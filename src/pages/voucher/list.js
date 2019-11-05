import React from 'react';
import './index.scss';
import {connect} from 'dva';
import router from 'umi/router';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import {
  PageHeader,
  Table,
  DatePicker,
	Button,
  Select,
  Form,
  Modal,
  Input,
  Checkbox,
  InputNumber,
  Popover,
  Tree
} from 'antd';
import {ShowMenuFilter} from '../../filter';
import {auxiliaryItemFilter,auxiliaryTitleFilter} from './voucherFilter';
const { MonthPicker, RangePicker } = DatePicker;
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
const { TreeNode } = Tree;

class AddSubject extends React.Component {
  render(){
    const { subjectChangeSelect,onSelect,list,selectValue } = this.props;
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.id} title={item.code+' '+item.name}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.code+' '+item.name} />;
      });
    return (
      <div>
        <div>
          <Select defaultValue={selectValue} style={{ width: 200 }} onChange={subjectChangeSelect}>
            <Option value="1">资产类</Option>
            <Option value="2">负债类</Option>
            <Option value="3">权益类</Option>
            <Option value="4">成本类</Option>
            <Option value="5">损益类</Option>
          </Select>
        </div>
        <div>
          <Tree
            className="draggable-tree"
            blockNode
            onSelect={onSelect}
            defaultExpandAll={true}
          >
            {loop(list)}
          </Tree>
        </div>
      </div>
    )
  }
}

@connect(
	state => ({
		voucherListData:state.voucher.voucherList,
    count:state.voucher.count,
    periodsListData:state.voucher.periodsList,
    defaultPeriod:state.voucher.defaultPeriod,
    wordsListData:state.voucher.wordsList,
    defaultWord:state.voucher.defaultWord,
    userListData:state.voucher.userList,
    auxiliaryListData:state.auxiliary.listData,
	}),
	{
		list: (isFirst) => ({
      type:'voucher/list',
      isFirst
    }),
    changeListData: (voucherList) => ({
      type:'voucher/changeListData',
      voucherList
    }),
    searchQuery: (query) => ({
      type:'voucher/searchQuery',
      query
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
    }),
    subjectList: (au_type,callback) => ({
      type:'subject/list',
      au_type,
      callback
    }),
    auxiliaryList: (au_type) => ({
      type:'auxiliary/list',
      au_type
    }),
	}
)
export class voucherListForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
      indeterminate:false,
      checkAll:false,
      pageSize:50,
      addVisible:false,
      title:'',
      isDefault:'',
      print_title:'',
      id:'',
      searchPeriod:0,
      searchStartTime:'',
      searchEndTime:'',
      searchWord:0,
      searchAbstract:'',
      searchNumber:'',
      searchCreator:0,
      searchStatus:0,
      searchSubjectVisible:false,
      subjectData:[],
      subjectData1:[],
      subjectData2:[],
      subjectData3:[],
      subjectData4:[],
      subjectData5:[],
      selectSubjectData:{},
      visibleModal:false
    }
    this.state.columns=[
      {
        title:<Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}></Checkbox>,
        dataIndex: 'checked',
        render: (text, row, index) => {
          const obj = {
            children: <Checkbox checked={text} onChange={e=>this.onCheckChange(e,row)}></Checkbox>,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      {
        title:'序号',
        dataIndex: 'id',
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      {
        title:'日期',
        dataIndex: 'input_time',
        render: (text, row, index) => {
          const obj = {
            children: moment(+text).format('YYYY-MM-DD'),
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      {
        title: '凭证字号',
        dataIndex: 'print_title',
        render: (text, row, index) => {
          const obj = {
            children: row.title +'-'+ row.number,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      {
        title: '摘要',
        dataIndex: 'abstract',
        render: (text, row, index) => {
          const obj = {
            children: text,
            props: {},
          };
          return obj;
        }
      },
      {
        title: '科目',
        dataIndex: 'auxiliaryChildren',
        render: (text, row, index) => {
          
          return <div>
            <div>{row.subjectCode + ' ' + row.subjectName}</div>
            <div>{auxiliaryItemFilter(row.auxiliaryChildren)}</div>
          </div>;
        }
      },
      {
        title: '借方金额',
        dataIndex: 'childDebit_amount',
        render: (text, row, index) => {
          
          return <div>
            {text>0?text:''}
          </div>;
        }
      },
      {
        title: '贷方金额',
        dataIndex: 'childCredit_amount',
        render: (text, row, index) => {
          
          return <div>
            {text>0?text:''}
          </div>;
        }
      },
      {
        title: '制单人',
        dataIndex: 'nickname',
        render: (text, row, index) => {
          const obj = {
            children: row.nickname,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      ,
      {
        title: '审核人',
        dataIndex: 'auditor',
        render: (text, row, index) => {
          const obj = {
            children: row.auditor,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      },
      {
        title: '操作',
        dataIndex: 'opertion',
        render: (text, row, index) => {
          const obj = {
            children: <div>
              <Button type="primary" onClick={this.handleSave}>
                冲销
              </Button>
              <Button type="danger" onClick={this.handleSave}>
                删除
              </Button>
            </div>,
            props: {},
          };
          obj.props.rowSpan  = row.rowLength
          return obj;
        }
      }
    ]
  }
  
  onCheckAllChange = e =>{
    this.props.voucherListData.forEach(item=>{
      item.checked = e.target.checked;
    })
    let list = [...this.props.voucherListData];
    this.props.changeListData(list);
    this.state.columns[0].title = <Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={e.target.checked}></Checkbox>;
    this.setState({
      // checkedList: e.target.checked ? plainOptions : [],
      // indeterminate: false,
      checkAll: e.target.checked,
      columns:this.state.columns
    });
  }

  onCheckChange = (e,row) => {
    let haveSelect = false;
    let noSelect = false;
    this.props.voucherListData.forEach(item=>{
      if(item.id == row.id){
        item.checked = e.target.checked;
      }
      if(item.checked){
        haveSelect = true;
      }else{
        noSelect = true;
      }
    });
    if(haveSelect == noSelect){
      this.state.columns[0].title = <Checkbox indeterminate={true} onChange={this.onCheckAllChange} checked={true}></Checkbox>;
    }else if(haveSelect){
      this.state.columns[0].title = <Checkbox indeterminate={false} onChange={this.onCheckAllChange} checked={true}></Checkbox>;
    }else if(noSelect){
      this.state.columns[0].title = <Checkbox indeterminate={false} onChange={this.onCheckAllChange} checked={false}></Checkbox>;
    }
    let list = [...this.props.voucherListData];
    this.props.changeListData(list);
    this.setState({
      columns:this.state.columns
    });
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
		this.props.list(true);
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
  rowKeyhandler = record =>{
    return record.id+'-'+record.childId
  }

  /**
   * search start
   */
  newLoop = (list,parent_id) =>{
    let newList=[];
    list.forEach(item=>{
      if(item.parent_id == parent_id){
        item.children = this.newLoop(list,item.id);
        newList.push(item);
      }
    })
    return newList;
  }
  handleVisibleChange = (v) => {
    let that = this;
    if(v && that.state.subjectData1.length==0){
      this.props.subjectList(1,function(list){
        list = that.newLoop(list,0);
        that.setState({
          searchSubjectVisible:v,
          subjectData:list,
          subjectData1:list
        })
      });
    }else{
      that.state.subjectData = that.state.subjectData1;
      that.setState({
        searchSubjectVisible:v,
        subjectData:that.state.subjectData
      })
    }
    
  }
  subjectChangeSelect = (value,option) => {
    let that = this;
    if(that.state['subjectData'+value].length>0){
      that.setState({
        subjectData:that.state['subjectData'+value]
      })
    }else{
      this.props.subjectList(value,function(list){
        list = that.newLoop(list,0);
        that.setState({
          subjectData:list,
          ['subjectData'+value]:list
        })
      });
    }
    
  }
  loop = (id,data,callback) =>{
    data.forEach(item => {
      if (item.id == id) {
        callback(item);
      }else if (item.children && item.children.length) {
        this.loop(id,item.children,callback)
      }
    });
    
  }
  onSubjectSelect = (e,b) =>{
    let that = this;
    that.loop(e[0],this.state.subjectData,function(item){
      console.log(item)
      
      that.setState({
        selectSubjectData:item,
        selectAuxiliaryType:item.auxiliaryTypes[0],
        auxiliary_id:'',
        searchSubjectVisible:false
      })
      that.props.auxiliaryList(item.auxiliaryTypes[0])
      that.props.form.setFieldsValue({
        searchSubjectId: item.code +" " +item.name
      });
    })
    
  }
  auxiliaryChangeSelect = (e) => {
    this.setState({
      selectAuxiliaryType:e,
      auxiliary_id:''
    })
    this.props.auxiliaryList(e);
  }
  auxiliaryIdChangeSelect = (e) => {
    this.setState({
      auxiliary_id:e
    })
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      let startTime = values.searchTime[0];
      let time = new Date(startTime._d);
      let newDate  = new Date();
      newDate.setFullYear(time.getFullYear())
      newDate.setMonth(time.getMonth())
      newDate.setDate(time.getDate())
      newDate.setHours(0)
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      values.startTime = "" + newDate.getTime();

      let endTime = values.searchTime[1];
      let time1 = new Date(endTime._d);
      let newDate1  = new Date();
      newDate1.setFullYear(time1.getFullYear())
      newDate1.setMonth(time1.getMonth())
      newDate1.setDate(time1.getDate()+1)
      newDate1.setHours(0)
      newDate1.setMinutes(0)
      newDate1.setSeconds(0)
      values.endTime = "" + newDate1.getTime();
      
      let subjectData = this.state.selectSubjectData;
      if(subjectData && subjectData.id){
        values.searchSubjectId = subjectData.id;
        if(subjectData.auxiliaryTypes && subjectData.auxiliaryTypes.length>0){
          if(this.state.auxiliary_id){
            values.auxiliary_id = this.state.auxiliary_id;
          }else{
            if(this.props.auxiliaryListData && this.props.auxiliaryListData.length>0){
              values.auxiliary_id = this.props.auxiliaryListData[0].id;
            }
          }
        }
      }
      console.log(values)
      this.props.searchQuery(values)
    });
  }
  handleReset = () => {
    this.setState({
      selectSubjectData:{}
    })
    this.props.form.resetFields();
  }
  handlePrint = () => {
    console.log('asd')
    this.setState({
      visibleModal: true,
    });
    setTimeout(function(){
      window.document.body.innerHTML = window.document.getElementById('print-modal').innerHTML; 
      window.print();
      window.location.reload();
    },300);
    
  }

  handleModalOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleModalCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
   /**
   * search end
   */
  
	render() {
    const {columns } = this.state;
    const { getFieldDecorator,getFieldValue } = this.props.form;
    const dateFormat = 'YYYY/MM/DD';
		return (
			<div className="role-page voucher-list">
        <PageHeader title="凭证列表"/>
        <Form className="search-panel" onSubmit={this.handleSearch}>
        
          <div className="search-row">
            <div className="search-item">
              <span className="labelname">凭证期数</span>
              <Form.Item>
                {getFieldDecorator('searchPeriod', {
                  rules: [],
                  initialValue:this.props.defaultPeriod
                })(
                  <Select style={{ width: 200}} className="search-item-ele">
                    {this.props.periodsListData.map((ele)=>{
                      return (<Option key={ele.id} value={ele.id}>{ele.period_year}年第{ele.period_month}期</Option>)
                    })}
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className="search-item n2">
              <span className="labelname">会计时间</span>
              <Form.Item>
                {getFieldDecorator('searchTime', {
                    rules: [],
                    initialValue:[moment().subtract('days',7), moment()]
                  })(
                  <RangePicker className="search-item-ele"
                    format={dateFormat} locale={locale}
                  />
                  )
                }
              </Form.Item>
              
            </div>
            <div className="search-item n2">
              <span className="labelname">凭证字</span>
              <Form.Item>
                {getFieldDecorator('searchWord', {
                    rules: [],
                    initialValue:this.props.defaultWord
                  })(
                    <Select style={{ width: 200 }} className="search-item-ele">
                      {this.props.wordsListData.map((ele)=>{
                        return (<Option key={ele.id} value={ele.id}>{ele.title}</Option>)
                      })}
                    </Select>
                  )
                }
              </Form.Item>
              
            </div>
          </div>
          <div className="search-row">
            <div className="search-item">
              <span className="labelname">摘要</span> 
              <Form.Item>
                {getFieldDecorator('searchAbstract', {
                    rules: []
                  })(
                    <Input placeholder="摘要" className="search-item-ele" style={{width:200}}/>
                  )
                }
              </Form.Item>
            </div>
            <div className="search-item n2">
              <Popover
                content={<AddSubject list={this.state.subjectData} onSelect={this.onSubjectSelect} subjectChangeSelect={this.subjectChangeSelect} selectValue={"1"}></AddSubject>}
                title="科目选择"
                trigger="click"
                visible={this.state.searchSubjectVisible}
                onVisibleChange={(v)=>this.handleVisibleChange(v)}
                placement="right"
                className="labelname subject-btn"
              >
                科目
              </Popover>
              <Form.Item>
                {getFieldDecorator('searchSubjectId', {
                    rules: []
                  })(
                    <Input disabled className="search-item-ele" style={{width:200}}/>
                  )
                }
              </Form.Item>
            </div>
            <div className="search-item n2">
              {this.state.selectSubjectData.auxiliaryTypes&&this.state.selectSubjectData.auxiliaryTypes.length>0?<div>
                <span className="labelname">辅助核算</span>
                <Select value={this.state.selectAuxiliaryType} style={{ width: 200 }} className="search-item-ele" onChange={this.auxiliaryChangeSelect}>
                  {this.state.selectSubjectData.auxiliaryTypes.map((ele)=>{
                    return (<Option key={ele} value={ele}>{auxiliaryTitleFilter(ele,2)}</Option>)
                  })}
                </Select>
                <Select value={(this.state.auxiliary_id || (this.props.auxiliaryListData.length>0 && this.props.auxiliaryListData[0].id))} style={{ width: 200 }} className="search-item-ele" onChange={this.auxiliaryIdChangeSelect}>
                  {this.props.auxiliaryListData.map((ele)=>{
                    return (<Option key={ele.id} value={ele.id}>{ele.name}</Option>)
                  })}
                </Select>
              </div>:''}
              
            </div>
          </div>
          <div className="search-row">
            <div className="search-item">
              <span className="labelname">凭证字号</span> 
              <Form.Item>
                {getFieldDecorator('searchNumber', {
                    rules: []
                  })(
                    <InputNumber className="search-item-ele" style={{width:200}}/>
                  )
                }
              </Form.Item>
            </div>
            <div className="search-item n2">
              <span className="labelname">制单人</span>
              <Form.Item>
                {getFieldDecorator('searchCreator', {
                    rules: []
                  })(
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      className="search-item-ele"
                      onChange={this.creatorChangeHandler}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option.props.children+'').toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.props.userListData.map((ele)=>{
                        return (<Option key={ele.id} value={ele.id}>{ele.nickname}({ele.email})</Option>)
                      })}
                    </Select>
                  )
                }
              </Form.Item>
            </div>
            <div className="search-item n2">
              <span className="labelname">状态</span>
              <Form.Item>
                {getFieldDecorator('searchStatus', {
                    rules: [],
                    initialValue:-1
                  })(
                    <Select style={{ width: 200 }} className="search-item-ele"
                    onChange={this.statusChangeHandler}>
                      <Option key={-1} value={-1}>全部</Option>
                      <Option key={1} value={1}>已审核</Option>
                      <Option key={0} value={0}>未审核</Option>
                    </Select>
                  )
                }
              </Form.Item>
              
            </div>
            
          </div>
          <div className="search-row">
            <div className="search-item">
              <span className="labelname"></span>
              <div>
              <Button type="primary" htmlType="submit" style={{'marginRight':10}}>搜索</Button>
              <Button type="primary" onClick={this.handleReset}>重置</Button>
              </div>
              <div style={{flex:1}}>
                <Button onClick={this.handleReset} style={{float:'right'}}>审核</Button>
                <ReactToPrint trigger={()=><Button onClick={this.handleReset} style={{float:'right','marginRight':10}} onClick={this.handlePrint}>打印</Button>}
                content={()=>this.refs}
                />
                <Button onClick={this.handleReset} style={{float:'right','marginRight':10}}>导出</Button>
              </div>
              
              
            </div>
          </div>
          
          
        </Form>
        <Table rowKey={this.rowKeyhandler}  pagination={{total:this.props.count,pageSize:this.state.pageSize}} className="data-list" columns={columns} dataSource={this.props.voucherListData} bordered />
        {/* <Modal
          visible={this.state.visibleModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <div id="print-modal">
            <div>记账凭证</div>
          </div>
        </Modal> */}

        <div ref={(el)=>this.refs = el}>
          <div className="">记账凭证</div>
          <div>123213</div>
        </div>
			</div>
		)
	}
}


const WrappedNormalVoucherListForm = Form.create({ name: 'normal_voucher_list' })(voucherListForm);

export default WrappedNormalVoucherListForm;