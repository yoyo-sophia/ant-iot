import React, { Component } from "react";
import { connect } from "dva";
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
    initialVerifyCode: "",
    autoLogin: true
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "login/getLoginCode"
    });// 获取验证码
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e) => {
    const { userName, password, verifyCode, initialVerifyCode, autoLogin } = this.state;
    const { dispatch } = this.props;

    e.preventDefault();
    if (!userName && !password && !verifyCode) {
      message.error("请输入完整的登录信息");
      return;
    }
    if (userName && password && !verifyCode) {
      message.error("请输入验证码");
      return;
    }
    if (verifyCode !== initialVerifyCode) {
      message.error("验证码错误");
      return;
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  render() {
    const { login } = this.props;

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
                <img className={styles.verifyImg}
                     src="http://n8.cmsfile.pg0.cn/group4/M00/03/BA/CgoOFlnoGnyAOQ54AABZQUxMv3E579.jpg?enable=&qt=75"
                     alt=""/>
              </div>
            </div>

            <Checkbox className={styles["autoLogin-wrap"]} checked={autoLogin}
                      onChange={this.changeAutoLogin}>记住密码</Checkbox>

            <Button type="primary" htmlType="submit">登录</Button>

          </Form>

        </div>
      </div>
    );
  }
}

export default LoginPage;
