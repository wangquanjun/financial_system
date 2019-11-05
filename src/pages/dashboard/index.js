import React, {
	Component
} from 'react';
import './index.scss';
import {connect} from 'dva';
import {
  Statistic,
  Icon,
  Timeline
} from "antd";
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';

@connect(
	state => ({}),
	{
    finishDisQR: googlecode => ({
      type:'googleauth/finishDisQR',
      googlecode
		})
	}
)
export default class dashboard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      googleCode:''
    };
  }

  onChangeGoogleCode = (e) => {
    this.setState({
      googleCode:e.target.value
    })
  }

  finishCode = ()=>{
    this.props.finishDisQR(this.state.googleCode);
  }

  componentDidMount(){
    // this.props.getQRImg();
  }

	render() {
    const data = [
      { genre: 'Jan', sold: 275, income: 2300 },
      { genre: 'Feb', sold: 115, income: 667 },
      { genre: 'Mar', sold: 120, income: 982 },
      { genre: 'Apr', sold: 350, income: 5271 },
      { genre: 'May', sold: 150, income: 3710 },
      { genre: 'Jun', sold: 350, income: 5271 },
      { genre: 'Jul', sold: 350, income: 5271 },
      { genre: 'Aug', sold: 350, income: 5271 },
      { genre: 'Sept', sold: 350, income: 5271 },
      { genre: 'Oct', sold: 350, income: 5271 },
      { genre: 'Nov', sold: 350, income: 5271 },
      { genre: 'Dec', sold: 1350, income: 5271 },
    ];
    
    // 定义度量
    const cols = {
      sold: { alias: '销售量' }, // 数据字段别名映射
      genre: { alias: '游戏种类' }
    };

    const lineData = [
      {
        year: "2011",
        value: 3
      },
      {
        year: "2012",
        value: 4
      },
      {
        year: "2013",
        value: 3.5
      },
      {
        year: "2014",
        value: 5
      },
      {
        year: "2015",
        value: 4.9
      },
      {
        year: "2016",
        value: 6
      },
      {
        year: "2017",
        value: 7
      },
      {
        year: "2018",
        value: 9
      },
      {
        year: "2019",
        value: 13
      }
    ];
    const lineCols = {
      value: {
        min: 0
      },
      year: {
        range: [0, 1]
      }
    };
    const lineBackground = {
      fill:'#3FCBBE'
    }

    const listData = [
      {
        icon:<Icon type="border-left" />,
        title:'发布新任务',
        value:'02'
      },
      {
        icon:<Icon type="border-left" />,
        title:'发布新任务',
        value:'02'
      }
    ]
		return ( 
      <div className="dashboard-page">
        <div className="da-content">
          <div className="card-list">
            <div className="card">
              <div className="card-icon">
                <Icon type="user" style={{ fontSize: '50px', color: '#fff' }} />
              </div>
              <div className="card-content">
                <Statistic title="新客户" value={100} />
              </div>
            </div>
            <div className="card">
              <div className="card-icon red">
                <Icon type="tags" style={{ fontSize: '50px', color: '#fff' }} />
              </div>
              <div className="card-content">
                <Statistic title="销售量" value={200} />
              </div>
            </div>
            <div className="card">
              <div className="card-icon yellow">
                <Icon type="shopping-cart" style={{ fontSize: '50px', color: '#fff' }} />
              </div>
              <div className="card-content">
                <Statistic title="新的订单" value={150} />
              </div>
            </div>
            <div className="card">
              <div className="card-icon blue">
                <Icon type="line-chart" style={{ fontSize: '50px', color: '#fff' }} />
              </div>
              <div className="card-content">
                <Statistic title="销售总额" value={112893} />
              </div>
            </div>
          </div>
          <div className="chart-panel">
            <div className="chart-left">
              <Chart height={400} data={data} scale={cols} forceFit>
                {/* X 轴 */}
                <Axis name="genre"/>
                {/* Y 轴 */}
                <Axis name="sold"/>
                <Tooltip />
                <Geom type="interval" position="genre*sold"/>
              </Chart>
            </div>
            <div className="chart-right">
              <Chart height={400} data={lineData} scale={lineCols}>
                <Axis name="year" />
                <Axis name="value" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="year*value" size={2} />
                <Geom
                  type="point"
                  position="year*value"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </div>
          </div>
          <div className="staff-panel">
            <div className='staff-left'>
              <div className="staff-body">
                <div className="sb-image">
                  <img src="http://thevectorlab.net/flatlab-4/img/avatar1.jpg"/>
                </div>
                <div className="sb-info">
                  <div>
                    <div className="sb-name">Anjelina Joli</div>
                    <div className="sb-job">高级建筑师</div>
                  </div>
                </div>
              </div>
              <div>
              <div className="task-panel">
                <div className="task-box">
                  <Icon type="ordered-list" style={{fontSize:'20px',color:'#c7cbd4'}}/>
                  <div className="task-name">发布新任务</div>
                  <div className="task-value">
                    02
                  </div>
                </div>
                <div className="task-box">
                  <Icon type="info-circle" style={{fontSize:'20px',color:'#c7cbd4'}}/>
                  <div className="task-name">任务待定</div>
                  <div className="task-value">
                    16
                  </div>
                </div>
                <div className="task-box">
                  <Icon type="mail" style={{fontSize:'20px',color:'#c7cbd4'}}/>
                  <div className="task-name">收件箱</div>
                  <div className="task-value">
                    45
                  </div>
                </div>
                <div className="task-box">
                  <Icon type="bell" style={{fontSize:'20px',color:'#c7cbd4'}}/>
                  <div className="task-name">新通知</div>
                  <div className="task-value">
                    09
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div className='staff-right'>
              <div className="sr-title">
                <div className="sr-job-name">工作进展</div>
                <div className="sr-name">Anjelina Joli</div>    
              </div>
              <div className="task-panel">
                <div className="task-box">
                  1
                  <div className="task-name">目标销售</div>
                  <div className="task-value">
                    <span className="badge danger">75%</span>
                  </div>
                </div>
                <div className="task-box">
                  2
                  <div className="task-name">产品交付</div>
                  <div className="task-value">
                    <span className="badge success">43%</span>
                  </div>
                </div>
                <div className="task-box">
                  3
                  <div className="task-name">付款收集</div>
                  <div className="task-value">
                    <span className="badge info">67%</span>
                  </div>
                </div>
                <div className="task-box">
                  4
                  <div className="task-name">工作进展</div>
                  <div className="task-value">
                    <span className="badge warning">30%</span>
                  </div>
                </div>
                <div className="task-box">
                  4
                  <div className="task-name">交货期待</div>
                  <div className="task-value">
                    <span className="badge primary">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="timeline-box">
            <Timeline mode="alternate">
              <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                beatae vitae dicta sunt explicabo.
              </Timeline.Item>
              <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
              <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
              <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
                Technical testing 2015-09-01
              </Timeline.Item>
            </Timeline>
          </div>
        </div>        
      </div>
    )
  }
}