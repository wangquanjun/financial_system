import {
  Dropdown,
  Icon,
  Menu,
  Button,
  Spin
} from "antd";
import React, {
  Component
} from "react";
import "./crm.scss";
import {
  connect
} from "dva";
import router from 'umi/router';
import {ShowMenuFilter} from '../filter';
const { SubMenu } = Menu;

@connect(
  state => ({
    isLoading: state.crm.isLoading
  })
)

class index extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      collapsed:false,
      rootSubmenuKeys:['sub1','sub9','sub7','sub8','sub6','sub4','sub5'],
      openKeys:['sub1']
    };
  }
  
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toDashboard(){
    router.push('/crm/dashboard')
  }

  toRole(){
    router.push('/crm/role')
  }

  toUser(){
    router.push('/crm/user')
  }

  toWorker(){
    router.push('/crm/worker')
  }

  toVoucher(){
    router.push('/crm/voucher/add')
  }
  toVoucherList(){
    router.push('/crm/voucher/list')
  }
  toVoucherWord(){
    router.push('/crm/voucher/word')
  }
  toAuxiliaryCustomer(){
    router.push('/crm/auxiliary/customer')
  }
  toAuxiliaryStock(){
    router.push('/crm/auxiliary/stock')
  }
  toAuxiliarySupplier(){
    router.push('/crm/auxiliary/supplier')
  }
  toAuxiliaryDepartment(){
    router.push('/crm/auxiliary/department')
  }
  toAuxiliaryProject(){
    router.push('/crm/auxiliary/project')
  }
  toAuxiliaryWorker(){
    router.push('/crm/auxiliary/worker')
  }
  toSubjectAssets(){
    router.push('/crm/subject/assets')
  }
  toSubjectLiabilities(){
    router.push('/crm/subject/liabilities')
  }
  toSubjectEquity(){
    router.push('/crm/subject/equity')
  }
  toSubjectCost(){
    router.push('/crm/subject/cost')
  }
  toSubjectProfitandloss(){
    router.push('/crm/subject/profitandloss')
  }
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  render() {
    const menu = (
      <Menu onClick={this.state.handleMenuClick}>
        <Menu.Item key="1">
          <Icon type="windows" />
          中心
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="setting" />
          设置
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="bell" />
          消息
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
          <Icon type="logout" />
          退出
        </Menu.Item>
      </Menu>
    );
    return ( 
      <div className="box-scripts">
        <div className="header">
          <div className="h-left">
            <Icon type="menu" className="sidebar-toggle-box"/>
            <a href="#" className="logo">雀萌财务系统</a>
          </div>
          <div className="h-right">
            <Dropdown overlay={menu} trigger="click">
              <Button>
              {/* <Avatar style={{ backgroundColor: '#87d068' }} icon="user" /> */}
              573296055@qq.com <Icon type="down" />
              </Button>
            </Dropdown>
            {/* <Icon type="align-right" /> */}
          </div>
        </div>
        <div className="box-center">
          <div className="menu-left">
            <Menu
              openKeys={this.state.openKeys}
              onOpenChange={this.onOpenChange}
              mode="inline"
              inlineCollapsed={this.state.collapsed}
            >
              <Menu.Item key="sub1" onClick={this.toDashboard}>
                <Icon type="dashboard" />
                <span>Dashboard</span>
              </Menu.Item>
              
              <SubMenu
                key="sub9"
                title={
                  <span>
                    <Icon type="solution" />
                    <span>科目管理</span>
                  </span>
                }
              >
                <Menu.Item key="91" onClick={this.toSubjectAssets}>资产类</Menu.Item>
                <Menu.Item key="92" onClick={this.toSubjectLiabilities}>负债类</Menu.Item>
                <Menu.Item key="93" onClick={this.toSubjectEquity}>权益类</Menu.Item>
                <Menu.Item key="94" onClick={this.toSubjectCost}>成本类</Menu.Item>
                <Menu.Item key="95" onClick={this.toSubjectProfitandloss}>损益类</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub7"
                title={
                  <span>
                    <Icon type="solution" />
                    <span>凭证管理</span>
                  </span>
                }
              >
                <Menu.Item key="71" onClick={this.toVoucher}>录凭证</Menu.Item>
                <Menu.Item key="72" onClick={this.toVoucherList}>查凭证</Menu.Item>
                <Menu.Item key="73" onClick={this.toVoucherWord}>凭证字</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub8"
                title={
                  <span>
                    <Icon type="solution" />
                    <span>辅助核算</span>
                  </span>
                }
              >
                <Menu.Item key="81" onClick={this.toAuxiliaryCustomer}>客户</Menu.Item>
                <Menu.Item key="82" onClick={this.toAuxiliaryStock}>存货</Menu.Item>
                <Menu.Item key="83" onClick={this.toAuxiliarySupplier}>供应商</Menu.Item>
                <Menu.Item key="84" onClick={this.toAuxiliaryDepartment}>部门</Menu.Item>
                <Menu.Item key="85" onClick={this.toAuxiliaryProject}>项目</Menu.Item>
                <Menu.Item key="86" onClick={this.toAuxiliaryWorker}>职员</Menu.Item>
              </SubMenu>
              {/* <SubMenu
                key="sub6"
                title={
                  <span>
                    <Icon type="solution" />
                    <span>工人管理</span>
                  </span>
                }
              >
                <Menu.Item key="65" onClick={this.toWorker}>工人列表</Menu.Item>
              </SubMenu> */}
              {ShowMenuFilter('/role/list')?<SubMenu
                key="sub4"
                title={
                  <span>
                    <Icon type="apartment" />
                    <span>角色管理</span>
                  </span>
                }
              >
                <Menu.Item key="44" onClick={this.toRole}>角色列表</Menu.Item>
              </SubMenu>:''}
              {ShowMenuFilter('/user/list')?<SubMenu
                key="sub5"
                title={
                  <span>
                    <Icon type="user" />
                    <span>账户管理</span>
                  </span>
                }
              >
                <Menu.Item key="53" onClick={this.toUser}>账户列表</Menu.Item>
              </SubMenu>:''}
              
            </Menu>
          </div>
          <div className="content-right">{this.props.children}</div> 
        </div>
        {this.props.isLoading?<div className="loading"><Spin size="large"/></div>:''}
      </div>
    );
  }
}

export default index;