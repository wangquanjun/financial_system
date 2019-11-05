import { Layout, Menu, Icon, Badge, Dropdown, Affix, Row, Col, Modal, Input } from "antd";
import Link from "umi/link";
import router from "umi/router";
import "./index.scss";
import { connect } from "dva";
import React, { Component } from "react";
import Common from '../pages/common';

const { Header, Footer, Content } = Layout;
const userinfo = JSON.parse(localStorage.getItem('userinfo'));
@connect(state => ({
  commonLanguage: state.common.commonLanguage,
  isLoading: state.common.isLoading,
  isLogined: state.user.isLogined,
  isShowGoogleAuthDialog: state.user.isShowGoogleAuthDialog
}),
{
  setShowGoogleAuthDialog: payload => ({
    type:'user/showGoogleAuthDialog',
    payload
  }),
  userLogin: payload=>({
    type:'user/login',
    payload
  }),
  userLogout: payload=>({
    type:'user/userLogout',
    payload
  })
})
class App extends Component {
  state = {
    selectedMenuName: "日本語",
    selectedMenuImg: "/image/japan.png",
    selectedMenuName1: "/image/japan.png",
    loading: false,
    top: 0,
    isShow: false,
    isShow1: false,
    userName: (userinfo&&userinfo.email) || '',
    modalIsOpen:'none'
  };
  componentDidMount() {
    const language = localStorage.getItem("language");
    if (language == "en-us") {
      this.setState({
        selectedMenuName: "English",
        selectedMenuName1: "/image/usa.png",
        selectedMenuImg: "/image/usa.png",
      })
    } else {
      this.setState({
        selectedMenuName: "日本語",
        selectedMenuName1: "/image/japan.png",
        selectedMenuImg: "/image/japan.png",
      })
    }
  }
  clickMenu(name, img, language) {
    this.setState({
      selectedMenuName: name,
      selectedMenuImg: img
    });
    localStorage.setItem("language", language);
    window.location.reload();
  }
  clickMenu1(status, data) {
    this.setState({
      isShow: status,
      isShow1: false,
      selectedMenuName1: data
    });
  }
  clickMenu2(data, language) {
    console.log(status, data);
    this.setState({
      isShow: false,
      isShow1: false,
      selectedMenuName1: data
    });
    localStorage.setItem("language", language);
    window.location.reload();
  }
  clickMenu3() {
    this.setState({
      isShow1: true,
      isShow: false,
    });
  }
  clickMenu4() {
    this.setState({
      isShow1: false,
      isShow: false,
    });
  }
  handleMouseOver(e){
    this.setState({
       modalIsOpen: 'block',
    })
  }

  handleMouseOut(){

    this.setState({
       modalIsOpen: 'none',
    })

  }
  handleMouseUserOver(e){
    this.setState({
        modalIsOpen: 'block',
    })
  }

  handleGoogleOk=e=>{
    if(this.state.googleCode){
      const values = {
        email:localStorage.getItem('googleUserName'),
        password:localStorage.getItem('googlePassword'),
        googleCode:this.state.googleCode
      }
      this.props.userLogin(values);
      // this.props.setShowGoogleAuthDialog({isShowGoogleAuthDialog:false})
    }
    
  }
  handleGoogleCancel = e => {
    this.props.setShowGoogleAuthDialog({isShowGoogleAuthDialog:false})
  }
  onChangeGoogleCode = (e) => {
    this.setState({
      googleCode:e.target.value
    })
  }
  handleLogout=e=>{
    localStorage.removeItem('token');
    this.props.userLogout({isLogined:false})
    router.push('/');
  }
  handleUserCenter = e=>{
    router.push('/account/center');
  }
  render() {
    const commonLanguage = this.props.commonLanguage;
    const menu = (
      <Menu style={{ marginRight: "15px" }}>
        <Menu.Item onClick={() => this.clickMenu("English", "/image/usa.png", "en-us")}>
          <img className="language" src="/image/usa.png" />
          English
        </Menu.Item>
        <Menu.Item onClick={() => this.clickMenu("日本語", "/image/japan.png", "ja")}>
          <img className="language" src="/image/japan.png" />
          日本語
        </Menu.Item>
      </Menu>
    );

    const { pathname } = this.props.location;
    const menus = [
      { path: "/", name: "home" },
      { path: "/xmc", name: "xmc" },
      { path: "/report", name: "report" },
    ];
    const selectedKeys = menus
      .filter(menu => {
        if (menu.path === "/") {
          return pathname === "/";
        }
        return pathname.startsWith(menu.path);
      })
      .map(menu => menu.path);
    return (
      // Layout

      <Layout>
        <Common></Common>

        {/* Header */}
        <Affix offsetTop={this.state.top}>
          <div className={this.state.isShow ? "show" : "hidden"}>
            <div className="app-mobile mobile-fixed-body" onClick={() => this.clickMenu4()} >
              <ul className="mobile-item-nav">
                <li onClick={() => this.clickMenu2("/image/usa.png", "en-us")}>
                  <img className="language" src="/image/usa.png" />
                  English
                </li>
                <li onClick={() => this.clickMenu2("/image/japan.png", "ja")}>
                  <img className="language" src="/image/japan.png" />
                  日本語
                </li>
              </ul>
            </div>
          </div>
          <div className={this.state.isShow1 ? "show" : "hidden"}>
            <div className="app-mobile mobile-fixed-body">
              <ul className="mobile-item-nav mobile-item-nav1">
                <li onClick={() => this.clickMenu4()}>
                  钱包
                </li>
                <li onClick={() => this.clickMenu4()}>
                  个人中心
                </li>
              </ul>
            </div>
          </div>
          <Header className="header header-pc">
            <Row>
              <Col span={19}>
                <Menu
                  className="menu"
                  mode="horizontal"
                  selectedKeys={selectedKeys}
                  style={{ lineHeight: "60px", float: "left" }}
                >
                  <Menu.Item key="/logo" className="nav-item">
                    <Link to="/">
                      <img className="logo" src="/image/logo.png" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/">
                    <Link to="/"> {commonLanguage.common_menu_home} </Link>
                  </Menu.Item>
                  <Menu.Item key="/xmc">
                    <Link to="/xmc">{commonLanguage.common_menu_xmc} </Link>
                  </Menu.Item>
                  <Menu.Item key="/report_unopen">
                    <Link to="/report_unopen">{commonLanguage.common_menu_report} </Link>
                  </Menu.Item>
                </Menu>
              </Col>

              <Col span={5} style={{ width: "360px" }}>
                {this.props.isLogined ? (
                  <Menu
                    className="menu1"
                    mode="horizontal"
                    style={{ lineHeight: "60px" }}
                  >
                    <Menu.Item className="username" >
                      <span className="namespan" onMouseOver={() => this.handleMouseOver()}
                             onMouseLeave={() => this.handleMouseOut()}>
                        {this.state.userName}  <Icon type="caret-down" />
                      </span>

                        <div className="menu-pc" style={{display:this.state.modalIsOpen}} 
                         onMouseOver={() => this.handleMouseUserOver()}
                         onMouseLeave={() => this.handleMouseOut()}>
                          <div className="menu-usercenter" onClick={this.handleUserCenter}>
                            <span></span>{commonLanguage.common_menu_account_1}
                          </div>
                          <div className="menu-wallet">
                            <div className="menu-balance"><span></span>{commonLanguage.common_menu_account_2}</div>
                            <div className="menu-recharge"><span></span>{commonLanguage.common_menu_account_3}</div>
                            <div className="menu-withdraw"><span></span>{commonLanguage.common_menu_account_4}</div>
                            <div className="menu-wallethistory"><span></span>{commonLanguage.common_menu_account_5}</div>
                          </div>
                          <div className="menu-earnings">
                            <span></span>{commonLanguage.common_menu_account_6}
                          </div>
                          <div className="menu-out" onClick={this.handleLogout}>
                            <span></span>{commonLanguage.common_menu_account_7}退出
                          </div>
                        </div>

                    </Menu.Item>

                    <Dropdown overlay={menu} placement="bottomCenter">
                      <a
                        className="dropdown"
                        href="#"
                        style={{ width: "60px" }}
                      >
                        <img
                          className="language"
                          src={this.state.selectedMenuImg}
                        />
                        {this.state.selectedMenuName}  <Icon type="caret-down" />
                      </a>
                    </Dropdown>
                  </Menu>
                ) : (
                    <Menu
                      className="menu1"
                      mode="horizontal"
                      style={{ lineHeight: "60px" }}
                    >

                      <Menu.Item key="/login_unopen">
                        <Link to="/login_unopen" className="go-login">
                          {commonLanguage.common_menu_login}
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="/register_unopen">
                        <Link to="/register_unopen" className="go-register">
                          {commonLanguage.common_menu_register}
                        </Link>
                      </Menu.Item>
                      <Dropdown overlay={menu} placement="bottomCenter">
                        <a
                          className="dropdown"
                          href="#"
                          style={{ width: "60px" }}
                        >
                          <img
                            className="language"
                            src={this.state.selectedMenuImg}
                          />
                          {this.state.selectedMenuName}  <Icon type="caret-down" />
                        </a>
                      </Dropdown>
                    </Menu>
                  )}

              </Col>
            </Row>
          </Header>
          {/* mobile navigation */}
          {this.props.isLogined ? (
            <Header className="header-mobile">
              <Menu
                className="menu1"
                mode="horizontal"
                style={{ lineHeight: "60px" }}
              >
                <Menu.Item key="/logo1" className="nav-item nav-item1">
                  <Link to="/">
                    <img className="logo" src="/image/logo.png" />
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/language"
                  className="mobile-nav-language mobile-nav-username"
                  onClick={() =>
                    this.clickMenu3("true")}>
                  <div className="username">{this.state.userName}</div>
                  <Icon type="caret-down" />
                </Menu.Item>
                <Menu.Item
                  key="/language1"
                  className="mobile-nav-language"
                  onClick={() => this.clickMenu1("true", this.state.selectedMenuName1)}>
                  <img className="language" src={this.state.selectedMenuName1} />
                  <Icon type="caret-down" />
                </Menu.Item>
              </Menu>
            </Header>
          ) : (
              <Header className="header-mobile">
                <Menu
                  className="menu1"
                  mode="horizontal"
                  style={{ lineHeight: "60px" }}
                >
                  <Menu.Item key="/logo2" className="nav-item nav320" >
                    <Link to="/">
                      <img className="logo" src="/image/logo.png" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/go-login">
                    <Link to="/go-login" className="go-login">
                      {commonLanguage.common_menu_login}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/go-register">
                    <Link to="/go-register" className="go-register">
                      {commonLanguage.common_menu_register}
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    key="/language3"
                    className="mobile-nav-language"
                    onClick={() =>
                      this.clickMenu1("true", this.state.selectedMenuName1)
                    }
                  >
                    <img
                      className="language"
                      src={this.state.selectedMenuName1}
                    />
                    <Icon type="caret-down" />
                  </Menu.Item>
                </Menu>
              </Header>
            )}
        </Affix>
        {/* 内容 */}
        <Content className="content">
          <div className="mobile-nav-next header-mobile">
            <Menu
              className="menu"
              mode="horizontal"
              selectedKeys={selectedKeys}
              style={{ lineHeight: "60px", float: "left" }}
            >
              <Menu.Item key="/">
                <Link to="/">{commonLanguage.common_menu_home}  </Link>
              </Menu.Item>
              <Menu.Item key="/xmc">
                <Link to="/xmc">{commonLanguage.common_menu_xmc}  </Link>
              </Menu.Item>
              <Menu.Item key="/report-mobile">
                <Link to="/report">{commonLanguage.common_menu_report} </Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="box">{this.props.children}</div>
        </Content>
        {/* 页脚 */}
        <Footer className="footer">
          <div className="footer-container">
            <div className="footer-title">XMiner</div>
            <div className="footer-content">
              <div className="footer-content-left">
                <ul className="first-ul">
                  <li>
                    <Link to="/">{commonLanguage.common_menu_home}  </Link>
                  </li>
                  <li>
                    <Link to="/xmc">{commonLanguage.common_menu_xmc}  </Link>
                  </li>
                  <li>
                    <Link to="/report_unopen">{commonLanguage.common_menu_report} </Link>
                  </li>
                </ul>
                <ul className="first-ul ml84">
                  <li>
                    <Link to="/userProfile">{commonLanguage.common_menu_account_1} </Link>
                  </li>
                  <li>
                    <Link to="/wallet">{commonLanguage.common_menu_account_2} </Link>
                  </li>
                  <li>
                    <Link to="/deposit">{commonLanguage.common_menu_account_3} </Link>
                  </li>
                  <li>
                    <Link to="/withdraw">{commonLanguage.common_menu_account_4} </Link>
                  </li>
                  <li>
                    <Link to="/walletHistory">{commonLanguage.common_menu_account_5} </Link>
                  </li>
                  <li>
                    <Link to="/userBonus">{commonLanguage.common_menu_account_6} </Link>
                  </li>
                </ul>
              </div>
              <div className="footer-content-right">
                <div className="footer-btn">{commonLanguage.common_menu_register}</div>
              </div>
            </div>

            <div className="footer-next">
              {commonLanguage.common_foot_copyright}
            </div>
            <div className="footer-next-dec">
              <span dangerouslySetInnerHTML={{ __html: `${commonLanguage.common_foot_risk}` }}></span>
            </div>
          </div>
        </Footer>
        {this.props.isLoading ? <div>loading</div> : ''}
        <Modal
          title="谷歌验证" visible={this.props.isShowGoogleAuthDialog}
          okText="确认"
          cancelText="取消"
          onOk={this.handleGoogleOk}
          onCancel={this.handleGoogleCancel}
          className="xminer"
        >
          <Input size="large" placeholder="输入谷歌验证码" onChange={this.onChangeGoogleCode} />
        </Modal>
      </Layout>
    );
  }
}
export default App;
