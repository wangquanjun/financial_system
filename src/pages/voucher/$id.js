import React from 'react';
import './index.scss';
import {connect} from 'dva';
import {
  message,
  Input,
  Icon,
	Button,
  Form,
  InputNumber,
  Row,
  Upload,
  Table,
  DatePicker,
  Select,
  Popover,
  Tree
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
// var uuid = require('react-native-uuid');
import uuid from 'react-native-uuid';
import moment from 'moment';
import {wordDefaultFilter,moneyToCapital} from '../../filter';
import {auxiliaryTitleFilter} from './voucherFilter';
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
          <Select defaultValue="1" value={selectValue} style={{ width: 200 }} onChange={subjectChangeSelect}>
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

class AddAuxiliary extends React.Component {
  render(){
    const { auxiliaryChangeSelect,list,auxiliarySaveClick,auxiliaryCancelClick } = this.props;
    return (
      <div className="auxiliary-popover">
        
        {list.map((item,ele)=>{
          return <div key={ele} className="auxiliary-box">
            <div>{auxiliaryTitleFilter(item.type,1)}</div>
            <div>
              <Select defaultValue={item.default} style={{ width: 200 }} onSelect={(value,option)=>auxiliaryChangeSelect(value,option,item.type)}>
                {item.list.map((ele,index)=>{
                  return (<Option key={index} value={ele.id}>{ele.name}</Option>)
                })}
              </Select>
            </div>
          </div>
        })}
        <div>
        <Button type="primary" className="auxiliary-save" onClick={auxiliarySaveClick}>保存</Button>
        <Button type="primary" onClick={auxiliaryCancelClick}>取消</Button>
        </div>

      </div>
    )
  }
}

@connect(
	state => ({
    wordListData:state.voucher.wordList,
    number:state.voucher.number,
    subjectListData:state.subject.listData,
    listDataTypes:state.auxiliary.listDataTypes,
    workerDetail:state.worker.workerDetail,
	}),
	{
    initData: voucherId => ({
      type:'voucher/initData',
      voucherId
    }),
    queryNumberByWordId: wordId => ({
      type:'voucher/queryNumberByWordId',
      wordId
    }),
    subjectList: (au_type,callback) => ({
      type:'subject/list',
      au_type,
      callback
    }),
    auxiliaryList: au_types => ({
      type:'auxiliary/listTypesApi',
      au_types
    }),
    addVoucher: (payload,isToList) => ({
      type:'voucher/addVoucher',
      payload,
      isToList
    }),
    updateWorker: payload => ({
      type:'worker/updateWorker',
      payload
    })
	}
)

class voucherInfoForm extends React.Component {
	constructor(props){
    super(props);
    console.log(props.match.params.id)
    
    let period_year = new Date().getFullYear();
    let period_month = new Date().getMonth()+1;
		this.state = {
      creator:localStorage.getItem('nickname'),
      d_total: 0,
      c_total: 0,
      dataList:[
        {
          id:1
        },
        {
          id:2
        },
        {
          id:3
        },
        {
          id:4
        },
        {
          id:5
        }
      ],
      columns: [
        {
          title: '摘要',
          dataIndex: 'abstract',
          width:250,
          render: (text, row, index) => {
            if (index < 4) {
              return <div><Input placeholder="摘要" value={text} onChange={(e)=>this.handleAbstractChange(e,index)}/></div>
            }
            return {
              children: <div className="number-total"><span>合计 {row.capitalLetters}</span></div>,
              props: {
                colSpan: 2,
              },
            };
          }
        },
        {
          title: '会计科目',
          dataIndex: 'subject',
          width:250,
          render: (text, row, index) => {
            if (index < 4) {
              return <div className="subject-box">
              <div>{text&&text.code} {text&&text.name}</div>
              <div>
                {row.auxiliaryList&&row.auxiliaryList.map(item=>{
                  return "-"+item.name
                })}
              </div>
              <Popover
                content={<AddSubject list={this.state.subjectData} onSelect={this.onSubjectSelect} subjectChangeSelect={this.subjectChangeSelect} selectValue={"1"}></AddSubject>}
                title="科目选择"
                trigger="click"
                visible={row.subjectVisible}
                onVisibleChange={(v)=>this.handleVisibleChange(v,index)}
                placement="right"
                className="subject"
              >
                科目
              </Popover>
              {(text&&text.auxiliaryTypes.length>0)?<Popover
                content={<AddAuxiliary list={this.props.listDataTypes} auxiliaryChangeSelect={this.auxiliaryChangeSelect} auxiliarySaveClick={this.auxiliarySaveClick} auxiliaryCancelClick={this.auxiliaryCancelClick}></AddAuxiliary>}
                trigger="click"
                visible={row.auxiliaryVisible}
                onVisibleChange={(v)=>this.handleAuxiliaryVisibleChange(v,index)}
                placement="right"
                className="auxiliary"
              >
                辅助核算
              </Popover>:''}
            </div>
            }
            return {
              props: {
                colSpan: 0,
              }
            };
          }
        },
        {
          title: '借方金额',
          dataIndex: 'debit_amount',
          children:[
            {
              title: '亿',
              dataIndex: 'd_billion',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(value)=>this.handleChangeNumber(value,'d_billion',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '千',
              dataIndex: 'd_must',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_must',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '百',
              dataIndex: 'd_million',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_million',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '十',
              dataIndex: 'd_hundredThousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_hundredThousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '万',
              dataIndex: 'd_tenThousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_tenThousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '千',
              dataIndex: 'd_thousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_thousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '百',
              dataIndex: 'd_hundred',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_hundred',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '十',
              dataIndex: 'd_ten',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_ten',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '元',
              dataIndex: 'd_one',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_one',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '角',
              dataIndex: 'd_horn',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_horn',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '分',
              dataIndex: 'd_branch',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'d_branch',index)} /></div>}else{
                return <div>{text}</div>
              }}
            }
          ]
        },
        {
          title: '贷方金额',
          dataIndex: 'credit_amount',
          children:[
            {
              title: '亿',
              dataIndex: 'c_billion',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_billion',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '千',
              dataIndex: 'c_must',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_must',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '百',
              dataIndex: 'c_million',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_million',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '十',
              dataIndex: 'c_hundredThousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_hundredThousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '万',
              dataIndex: 'c_tenThousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_tenThousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '千',
              dataIndex: 'c_thousand',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_thousand',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '百',
              dataIndex: 'c_hundred',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_hundred',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '十',
              dataIndex: 'c_ten',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_ten',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '元',
              dataIndex: 'c_one',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_one',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '角',
              dataIndex: 'c_horn',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_horn',index)} /></div>}else{
                return <div>{text}</div>
              }}
            },
            {
              title: '分',
              dataIndex: 'c_branch',
              align:'center',
              className:'table_number',
              render:(text, record, index)=>{if (index < 4) {return <div><InputNumber value={text} precision={0} min={0} max={9} onChange={(e)=>this.handleChangeNumber(e,'c_branch',index)} /></div>}else{
                return <div>{text}</div>
              }}
            }
          ],
        },
      ],
      voucherType:props.match.params.id == 'add'?'add':'update',
      voucherId:props.match.params.id,
      token:localStorage.getItem('token'),
      qm_uuid:uuid.v1(),
      period_year,
      period_month,
      numberOfPeriods:(period_year + '年第' + period_month +'期'),
      subjectData:[],
      subjectData1:[],
      subjectData2:[],
      subjectData3:[],
      subjectData4:[],
      subjectData5:[],
      auxiliarySelect:[]
    }
  }

  componentWillUpdate(nextProps, nextState){
    if(nextProps.number != this.props.number){
      this.props.form.setFieldsValue({
        voucher_number: nextProps.number
      });
      this.setState({
        d_total: 0,
        c_total: 0,
        dataList:[
          {
            id:1
          },
          {
            id:2
          },
          {
            id:3
          },
          {
            id:4
          },
          {
            id:5
          }
        ]
      })
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
    this.loop(e[0],this.state.subjectData,function(item){
      that.state.dataList[that.state.subjectIndex].subject = item;
      that.state.dataList[that.state.subjectIndex].subjectVisible = false;

      that.state.dataList[that.state.subjectIndex].auxiliaryList = [];
      that.state.dataList[that.state.subjectIndex].auxiliaryVisible = false;
      that.setState({
        dataList:that.state.dataList
      })
      console.log(that.state.dataList)
    })
    
  }

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
  handleVisibleChange = (v,index) => {
    console.log(v,index);
    let that = this;
    if(v && that.state.subjectData1.length==0){
      this.props.subjectList(1,function(list){
        list = that.newLoop(list,0);
        that.state.dataList[index].subjectVisible = v;
        that.setState({
          dataList:that.state.dataList,
          subjectIndex:index,
          subjectData:list,
          subjectData1:list
        })
      });
    }else{
      that.state.dataList[index].subjectVisible = v;
      that.state.subjectData = that.state.subjectData1;
      that.setState({
        dataList:that.state.dataList,
        subjectIndex:index,
        subjectData:that.state.subjectData
      })
    }
    
  }

  subjectChangeSelect = (value,option) => {
    console.log(value)
    let that = this;
    console.log(that.state['subjectData'+value])
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
        console.log(that.state);
      });
    }
    
  }
  
  handleAuxiliaryVisibleChange = (v,index) => {
    console.log(v,index);
    if(v){
      let types = this.state.dataList[index].subject.auxiliaryTypes.join(',');
      this.props.auxiliaryList(types);
    }
    this.state.dataList[index].auxiliaryVisible = v;
    this.setState({
      dataList:this.state.dataList,
      subjectIndex:index
    })
  }

  auxiliaryChangeSelect = (value,option,type) =>{
    console.log(value,type)
    if(this.state.auxiliarySelect.length==0){
      this.state.auxiliarySelect.push({
        type:type,
        id:value
      })
    }else{
      let isHaveType = false;
      this.state.auxiliarySelect.forEach(item=>{
        if(item.type == type){
          isHaveType = true;
          item.id = value;
        }
      })
      if(!isHaveType){
        this.state.auxiliarySelect.push({
          type:type,
          id:value
        })
      }
    }
    
    console.log(this.state.auxiliarySelect)
  }

  auxiliarySaveClick = () => {
    let auxiliarySelect = [];
    let that = this;
    if(that.state.auxiliarySelect.length==0){
      that.props.listDataTypes.forEach(item=>{
        auxiliarySelect.push({
          type:item.type,
          id:item.default
        })
      })
    }else{
      auxiliarySelect = that.state.auxiliarySelect;
    }
    auxiliarySelect.forEach(item=>{
      that.props.listDataTypes.forEach(v=>{
        if(v.type == item.type){
          v.list.forEach(b=>{
            if(b.id == item.id){
              item.name = b.name;
              item.code = b.code;
            }
          })
        }
        
      })
    })
    that.state.dataList[that.state.subjectIndex].auxiliaryList = auxiliarySelect;
    that.state.dataList[that.state.subjectIndex].auxiliaryVisible = false;
    that.setState(
      {
        dataList:that.state.dataList
      }
    )
  } 
  auxiliaryCancelClick = () => {
    this.state.dataList[this.state.subjectIndex].auxiliaryVisible = false;
    this.setState({
      dataList:this.state.dataList,
      auxiliarySelect:[]
    })
  } 

  onWordChangeSelect = (value) => {
    console.log(value)
    this.props.queryNumberByWordId(value);
  }

  handleAbstractChange = (value,index) => {
    console.log(value.target.value,index)
    this.state.dataList[index].abstract = value.target.value;
    this.setState({
      dataList:this.state.dataList
    })
  }

  handleChangeNumber = (value,dataIndex,index) => {
    console.log(value);
    value = typeof(value) == 'number'?value:0;
    this.state.dataList[index][dataIndex] = value;
    let d_total = 0;
    let c_total = 0;
    this.state.dataList.forEach(item=>{
      let d_billion = typeof(item.d_billion) != 'number'?0:item.d_billion+'';
      let d_must = typeof(item.d_must) != 'number'?0:item.d_must+'';
      let d_million = typeof(item.d_million) != 'number'?0:item.d_million+'';
      let d_hundredThousand = typeof(item.d_hundredThousand) != 'number'?0:item.d_hundredThousand+'';
      let d_tenThousand = typeof(item.d_tenThousand) != 'number'?0:item.d_tenThousand+'';
      let d_thousand = typeof(item.d_thousand) != 'number'?0:item.d_thousand+'';
      let d_hundred = typeof(item.d_hundred) != 'number'?0:item.d_hundred+'';
      let d_ten = typeof(item.d_ten) != 'number'?0:item.d_ten+'';
      let d_one = typeof(item.d_one) != 'number'?0:item.d_one+'';
      let d_horn = typeof(item.d_horn) != 'number'?0:item.d_horn+'';
      let d_branch = typeof(item.d_branch) != 'number'?0:item.d_branch+'';

      let a = d_billion + d_must + d_million + d_hundredThousand + d_tenThousand+
      d_thousand + d_hundred + d_ten + d_one + '.' + d_horn + d_branch
      item.debit_amount = a;
      d_total+=Number(a);

      let c_billion = typeof(item.c_billion) != 'number'?0:item.c_billion+'';
      let c_must = typeof(item.c_must) != 'number'?0:item.c_must+'';
      let c_million = typeof(item.c_million) != 'number'?0:item.c_million+'';
      let c_hundredThousand = typeof(item.c_hundredThousand) != 'number'?0:item.c_hundredThousand+'';
      let c_tenThousand = typeof(item.c_tenThousand) != 'number'?0:item.c_tenThousand+'';
      let c_thousand = typeof(item.c_thousand) != 'number'?0:item.c_thousand+'';
      let c_hundred = typeof(item.c_hundred) != 'number'?0:item.c_hundred+'';
      let c_ten = typeof(item.c_ten) != 'number'?0:item.c_ten+'';
      let c_one = typeof(item.c_one) != 'number'?0:item.c_one+'';
      let c_horn = typeof(item.c_horn) != 'number'?0:item.c_horn+'';
      let c_branch = typeof(item.c_branch) != 'number'?0:item.c_branch+'';

      let b = c_billion + c_must + c_million + c_hundredThousand + c_tenThousand+
      c_thousand + c_hundred + c_ten + c_one + '.' + c_horn + c_branch
      item.credit_amount = b;
      c_total+=Number(b);
    })
    if(d_total>999999999.99){
      d_total = 999999999.99
    }
    if(d_total>999999999.99){
      c_total = 999999999.99
    }
    
    let totalData = {
      id:5
    };
    if(d_total>0){
      d_total = d_total.toFixed(2);
      totalData.capitalLetters = moneyToCapital(d_total);
      totalData.d_total = d_total;
      let d_length = d_total.length;
      for(let i=0;i<d_length;i++){
        let start = d_length-(i+1);
        let stop = d_length-i;
        let num = d_total.substring(start,stop);
        if(i==0){
          totalData.d_branch = num;
        }else if(i==1){
          totalData.d_horn = num;
        }else if(i==3){
          totalData.d_one = num;
        }else if(i==4){
          totalData.d_ten = num;
        }else if(i==5){
          totalData.d_hundred = num;
        }else if(i==6){
          totalData.d_thousand = num;
        }else if(i==7){
          totalData.d_tenThousand = num;
        }else if(i==8){
          totalData.d_hundredThousand = num;
        }else if(i==9){
          totalData.d_million = num;
        }else if(i==10){
          totalData.d_must = num;
        }else if(i==11){
          totalData.d_billion = num;
        }
      }
    }
    
    if(c_total>0){
      c_total = c_total.toFixed(2);
      totalData.c_total = c_total;
      totalData.capitalLetters = moneyToCapital(d_total);
      let c_length = c_total.length;
      for(let i=0;i<c_length;i++){
        let start = c_length-(i+1);
        let stop = c_length-i;
        let c_num = c_total.substring(start,stop);
        if(i==0){
          totalData.c_branch = c_num;
        }else if(i==1){
          totalData.c_horn = c_num;
        }else if(i==3){
          totalData.c_one = c_num;
        }else if(i==4){
          totalData.c_ten = c_num;
        }else if(i==5){
          totalData.c_hundred = c_num;
        }else if(i==6){
          totalData.c_thousand = c_num;
        }else if(i==7){
          totalData.c_tenThousand = c_num;
        }else if(i==8){
          totalData.c_hundredThousand = c_num;
        }else if(i==9){
          totalData.c_million = c_num;
        }else if(i==10){
          totalData.c_must = c_num;
        }else if(i==11){
          totalData.c_billion = c_num;
        }
      }
    }
    
    this.state.dataList[4] = totalData;
    this.setState({
      dataList:this.state.dataList,
      d_total,
      c_total
    })
  }

	componentDidMount(){
    this.props.initData(this.state.voucherType == 'update'?this.state.voucherId:'');
  }
  
  handleSaveAnd=e=>{
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.loadDataSave(values,false)
      }
    });
  }
  handleSave = e => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        this.loadDataSave(values,true)
      }
    });
  }

  loadDataSave = (values,isToList) => {
    let newList = [];
    let isError = false;
    console.log(this.state.dataList)
    this.state.dataList.forEach(item=>{
      if(item.debit_amount>0 || item.credit_amount>0){
        if(!item.abstract){
          isError = true;
          message.warning('请填写摘要');
        }
        if(!item.subject){
          isError = true;
          message.warning('请选择科目');
        }
        newList.push(item);
      }
    })
    var data = this.state.dataList[4];
    if(data.d_total != data.c_total){
      isError = true;
      message.warning('两步金额不等');
    }
    if(newList.length<2){
      isError = true;
      message.warning('请至少填写两条');
    }
    if(!isError){
      var newDate = new Date(values.input_time._d);
      values.input_time = "" + newDate.getTime();
      values.newList = newList;
      values.debit_amount = this.state.d_total;
      values.credit_amount = this.state.c_total;
      values.period_year = this.state.period_year;
      values.period_month = this.state.period_month;
      this.props.addVoucher(values,isToList)
    }
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
    const {columns} = this.state;
    const config = {
      rules: [{required: true, message: '请选择日期' }],
      // initialValue:this.props.workerDetail.birth_time?moment(moment(+this.props.workerDetail.birth_time).format('YYYY-MM-DD')):moment(moment(new Date().getTime()).format('YYYY-MM-DD'))
      initialValue:moment(moment(new Date().getTime()).format('YYYY-MM-DD'))
    };
		return (
			<div className="voucher-page">
        <div className="voucher-panel">
          <Form layout="inline" className="worker-add">
            <div>
              <Form.Item className="voucher-title">
                <span className="voucher-1">记账凭证</span>
                <span className="voucher-2">{this.state.numberOfPeriods}</span>
              </Form.Item>
            </div>
            <div>
              <Form.Item label="凭证号" className="voucher-number">
                {getFieldDecorator('word_id',{
                  initialValue:wordDefaultFilter(this.props.wordListData)
                })(
                  <Select style={{ width: 55 }} onChange={this.onWordChangeSelect}>
                    {this.props.wordListData.map(item=>{
                      return <Option key={item.id} value={item.id}>{item.title}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('voucher_number', {
                  rules: [
                    {
                      required: true,
                      message: '请输入凭证号'
                    }
                  ],
                  initialValue:this.props.number
                })(
                  <InputNumber formatter={value => `${value}号`} style={{ width: 85 }}
                    layout = "vertical" suffix="号" 
                  />,
                )}
              </Form.Item>
              <Form.Item label="日期" className="group-box">
                {getFieldDecorator('input_time', config)(<DatePicker locale={locale}/>)}
              </Form.Item>
              <Form.Item className="upload-bill">
                {getFieldDecorator('upload', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload name="file" onChange={this.uploadImage} data={{token:this.state.token,uuid:this.state.qm_uuid}} action="/api/upload/file" listType="picture">
                    <Button>
                      <Icon type="upload" />附单据
                    </Button>
                  </Upload>,
                )}
              </Form.Item>
            </div>
            <div className="table_panel">
              <Table bordered={true} rowKey={record=>record.id} pagination={false} className="data-list" columns={columns} dataSource={this.state.dataList} />
            </div>
            <div className="table_footer">
              <div className="single_person">
                <Form.Item>
                  制单人：{this.state.creator}
                </Form.Item>
              </div>
              <div>
                <Form.Item>
                  <Button type="primary" className="login-form-button" onClick={this.handleSaveAnd}>
                    保存并新增
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" className="login-form-button" onClick={this.handleSave}>
                    保存
                  </Button>
                </Form.Item>
              </div>
            </div>

          </Form>
        </div>
        
			</div>
		)
	}
}


const WrappedNormalVoucherForm = Form.create({ name: 'normal_voucher' })(voucherInfoForm);

export default WrappedNormalVoucherForm;