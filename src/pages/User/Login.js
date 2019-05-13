import React, { Component } from "react";
import { connect } from "dva";
import router from 'umi/router';
import { Form, Button, Checkbox, Icon, message } from "antd";
import styles from "./Login.less";

@connect(({ login, loading }) => ({
  login
  // submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "account",
    userName: "",
    password: "",
    verifyCode: "",
    autoLogin: true,
    btnLoading:false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if(!localStorage.getItem('token')){
      // 获取token
      dispatch({
        type:'login/userToken',
        callback:(res)=>{
          if(res.state===1){
            // 获取验证码
            dispatch({
              type: "login/getLoginCode",
              payload:{
                unique:res.data
              }
            });// 获取验证码
          }
        }
      });
    }else{
      router.push('/landing')
    }
  };

  getLoginCode = () =>{
    const {login:{token},dispatch} = this.props;
    dispatch({
      type: "login/getLoginCode",
      payload:{
        unique:token
      }
    });// 获取验证码
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e) => {
    const { userName, password, verifyCode, autoLogin } = this.state;
    const { dispatch ,login:{loginCode,token}} = this.props;
    let _this = this;

    e.preventDefault();
    if (!userName && !password && !verifyCode) {
      message.error("请输入完整的登录信息");
      return;
    }
    if (userName && password && !verifyCode) {
      message.error("请输入验证码");
      return;
    }

    dispatch({
      type:'login/login',
      payload:{
        username:userName,
        password:password,
        unique:token,
        code:verifyCode,
      },
      callback:(res) =>{
        _this.setState({
          btnLoading:false
        });
        message.error(res.msg);
      }
    });

    // this.setState({
    //   btnLoading:true
    // })

  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  render() {
    const { login:{token,loginCode} } = this.props;
    const { type, autoLogin, userName, password, verifyCode } = this.state;
    return (
      <div className={styles.main}>

        <div className={styles["login-wrap"]}>

          <div className={styles["logo-wrap"]}>
            <span className={styles["bg-logo"]}/>
          </div>

          <Form onSubmit={this.handleSubmit}>

            <div className={styles["account-wrap"]}>
              <span>用户名</span>
              <div className={styles["input-wrap"]}>
                <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }}/>
                <input name="userName" value={userName} onChange={this.handleChange.bind(this)} type="text"
                       placeholder="请输入用户名"/>
              </div>
            </div>

            <div className={styles["account-wrap"]}>
              <span>密码</span>
              <div className={styles["input-wrap"]}>
                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }}/>
                <input name="password" value={password} onChange={this.handleChange.bind(this)} type="password"
                       placeholder="请输入密码"/>
              </div>
            </div>

            <div className={`${styles["account-wrap"]} ${styles["verify-code-wrap"]}`}>
              <span>验证码</span>
              <div className={styles["input-wrap"]}>
                <input name="verifyCode" value={verifyCode} onChange={this.handleChange.bind(this)} type="text"
                       placeholder="请输入验证码"/>
                <img onClick={this.getLoginCode} className={styles.verifyImg}
                     src={loginCode}
                     alt="验证码"/>
              </div>
            </div>

            {/*<Checkbox className={styles["autoLogin-wrap"]} checked={autoLogin}*/}
                      {/*onChange={this.changeAutoLogin}>记住密码</Checkbox>*/}

            <Button type="primary" htmlType="submit" disabled={this.state.btnLoading} loading={this.state.btnLoading} >登录</Button>

          </Form>

        </div>
      </div>
    );
  }
}

export default LoginPage;
