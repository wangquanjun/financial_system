import React, { Component } from "react";
import { Row, Col, Card, Button,Affix } from "antd";
import "./xmc.scss";
import { connect } from "dva";
import Link from "umi/link";

@connect(
  state => ({
    xmcLanguage:state.common.xmcLanguage,
	})
)
class xmc extends Component {
 componentDidMount(){
    // window.document.title = this.props.xmcLanguage.mxc_page_title;
 }
 componentWillReceiveProps(props) {
  window.document.title = props.xmcLanguage.mxc_page_title;
 
}
  render() {
    const xmcLanguage = this.props.xmcLanguage;
    console.log(xmcLanguage)
    return (
      <div className="xmc-page">
        <div className="xmc-page-container">
        <Row>
          <Col span={18}>
            <div className="xmc-header">
              <div className="xmc-header-left">
                <div>
                  <img src="/image/logo_mxc01.png" alt="" />
                </div>
                <div>
                  <div className="xmc-coin">XMC01</div>
                  <div className="earnings">
                    {/* 预计收益:<span>15%</span> */}
                    {xmcLanguage.mxc_rate}
                  </div>
                </div>
              </div>
              <div className="xmc-header-right">
                <Link to="/calculator"><span>{xmcLanguage.mxc_calculator}</span></Link>
              </div>
            </div>
            <div className="xmc-bottom">
            {localStorage.getItem("language") =="en-us" ? (
               <img src="/image/en_mxc01.png" alt="" />
            ):(
              <img src="/image/ja_mxc01.png" alt="" />
            )}
            </div>
           
            {/* {localStorage.getItem("language") =="en-us" ? (
               <div className="xmc-bottom-en"></div>
            ):(
              <div className="xmc-bottom-ja"></div>
            )} */}
             
          </Col>
          <Col span={6} className="xmc-operator-container operator-pc">
          <Affix offsetTop={60} >
            <div className="xmc-operator">
                <span className="xmc-tag">
                    {xmcLanguage.mxc_status1}
                </span>
              <Card title= {xmcLanguage.mxc_buy01_1} bordered={false}>
              {xmcLanguage.mxc_buy01_2}
              </Card>
              <Card title={xmcLanguage.mxc_buy01_3} bordered={false}>
              {xmcLanguage.mxc_buy01_4} 
              </Card>
              <Card title={xmcLanguage.mxc_buy01_5}  bordered={false}>
                <span className="price">{xmcLanguage.mxc_buy01_6} </span>{" "}
              </Card>
              <Card title={xmcLanguage.mxc_buy01_7} bordered={false}>
                <span className="fund-data">
                {xmcLanguage.mxc_buy01_8}
                </span>
              </Card>
              <Card title={xmcLanguage.mxc_buy01_9} bordered={false}>
                <span className="fund-data">{xmcLanguage.mxc_buy01_10}</span>
              </Card>
              <Button type="primary" block>
                {xmcLanguage.mxc_buy01_11}
              </Button>
            </div>
          </Affix>
          
          </Col>
          <Col span={6} className="xmc-operator-container operator-mobile">
          <div className="xmc-operator">
                <span className="xmc-tag">
                    {xmcLanguage.mxc_status1}
                </span>
              <Card title= {xmcLanguage.mxc_buy01_1} bordered={false}>
              {xmcLanguage.mxc_buy01_2}
              </Card>
              <Card title={xmcLanguage.mxc_buy01_3} bordered={false}>
              {xmcLanguage.mxc_buy01_4} 
              </Card>
              <Card title={xmcLanguage.mxc_buy01_5}  bordered={false}>
                <span className="price">{xmcLanguage.mxc_buy01_6} </span>{" "}
              </Card>
              <Card title={xmcLanguage.mxc_buy01_7} bordered={false}>
                <span className="fund-data">
                {xmcLanguage.mxc_buy01_8}
                </span>
              </Card>
              <Card title={xmcLanguage.mxc_buy01_9} bordered={false}>
                <span className="fund-data">{xmcLanguage.mxc_buy01_10}</span>
              </Card>
              <Button type="primary" block>
                {xmcLanguage.mxc_buy01_11}
              </Button>
            </div>
          </Col>
        </Row>
        </div>
        
      </div>
    );
  }
}
export default xmc;
