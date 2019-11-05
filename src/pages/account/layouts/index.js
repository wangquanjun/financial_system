import React, { Component } from 'react'
import { Layout,Menu,Icon } from 'antd';
import "./index.scss";
const { Sider, Content } = Layout;

import Link from "umi/link";

  
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
    render() {
        const { pathname } = this.props.location;
        const menus = [
            { path: "/account/center", name: "center" },
            { path: "/account/balance", name: "balance" },
            { path: "/account/recharge", name: "recharge" },
            { path: "/account/withdraw", name: "withdraw" },
            { path: "/account/history", name: "history" },
            { path: "/account/earnings", name: "earnings" },
          ];
          const selectedKeys = menus
            .filter(menu => {
              if (menu.path === "/account/") {
                return pathname === "/account/";
              }
              return pathname.startsWith(menu.path);
            
            })
            .map(menu => menu.path);

            console.log(selectedKeys)
        return (
            <div className="box-account">
                <Layout>
                    <Sider>
                        <Menu theme="dark" mode="inline"   selectedKeys={selectedKeys}  style={{ padding: "0 30px 20px 30px",marginTop:"20px" }} >
                            <Menu.Item key="/account/center" className="user" style={{ borderBottom: "1px solid #edecec",paddingBottom:"20px"}}>
                               <Link to="/account/center">
                               <i className="center"></i>
                                <span className="nav-text">个人信息</span>
                               </Link> 
                            </Menu.Item>
                            <Menu.Item key="/account/balance" style={{ height:"30px" }}>
                                <Link to="/account/balance">
                              <i className="balance"></i>
                                <span className="nav-text">钱包余额</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/account/recharge" style={{ height:"30px" }}>
                            <Link to="/account/recharge">
                                <i className="recharge"></i>
                                <span className="nav-text">充值记录</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/account/withdraw" style={{ height:"30px" }}>
                            <Link to="/account/withdraw">
                            <i className="withdraw"></i>
                                <span className="nav-text">提币记录</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/account/history" style={{ height:"30px" }}>
                            <Link to="/account/history">
                            <i className="history"></i>
                                <span className="nav-text">钱包历史</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/account/earnings" style={{ borderTop: "1px solid #edecec" ,paddingTop:"20px"}}>
                            <Link to="/account/earnings">
                            <i className="earnings "></i>
                                <span className="nav-text">我的收益</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content><div className="account-box">{this.props.children}</div></Content>
                </Layout>
            </div>
        )
    }
}
