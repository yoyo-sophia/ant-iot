import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { Row, Col, Tree, Card, Form, Input, Button, Divider, Checkbox, Modal, message } from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";
import router from "umi/router";

const FormItem = Form.Item;

// 分配角色权限
const DispatchRoleModal = Form.create()((props) => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    roleLists,
    roleInitialLists
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      handleAdd(fieldValue);
    });
  };

  return (
    <Modal
      title="分配角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem label="角色列表">
        {
          form.getFieldDecorator("roleListItem", {
            initialValue: roleInitialLists
          })(
            <Checkbox.Group style={{ width: "100%" }}>
              <Row>
                {
                  roleLists.map((item, index) => {
                    return (
                      <Col key={index} span={8}>
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      </Col>
                    );
                  })
                }
              </Row>
            </Checkbox.Group>
          )
        }
      </FormItem>
    </Modal>
  );
});

// 创建账号
const CreateTopPartner = Form.create()((props)=>{
  const {
    form,
    modalVisible,
    handleModalVisible,
    submitCreateAccount,//提交数据
    createAccountData,// 初始数据
  } = props;

  const submit = () =>{
    form.validateFields((err, fieldValue) => {
      if (err) return;
      submitCreateAccount(fieldValue);
    });
  };

  return(
    <Modal
      title="创建账号"
      visible={modalVisible}
      onOk={submit}
      onCancel={()=>handleModalVisible()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="账号名称">
        {form.getFieldDecorator("nickname", {
          initialValue:createAccountData.nickname,
          rules: [{
            required: true,
            message: "请输入代理商名称"
          }]
        })(<Input placeholder="请输入代理商名称"/>)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="账号名称">
        {form.getFieldDecorator("password", {
          initialValue: createAccountData.password,
          rules: [{ required: true, message: "请输入密码" }]
        })(<Input type="password" placeholder="请输入密码"/>)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator("mobile", {
          initialValue: createAccountData.mobile,
          rules: [{ required: true, message: "请输入手机号码" }]
        })(<Input placeholder="请输入手机号码"/>)}
      </FormItem>

    </Modal>
  )


});

@Form.create()

@connect(({ authority, user, loading }) => ({
  user,
  authority,
  tableLoading:loading.effects['authority/fetch_account_list'],//table loading
}))

class account_setting extends Component {
  state = {
    selectedRows: [],
    // 分配角色相数据
    rowInfo:{},
    roleLists:[], // 角色数据列表
    roleInitialLists: [1, 3], // 当前账号已有角色数据
    modalVisible: false, // 分配角色弹窗控制参数
    // 创建账号相关参数
    createModalVisible:false, // 创建账号弹窗控制参数
    createAccountData:{
      nickname:'',
      password:'',
      mobile:''
    },
    // 表格相关数据
    initialPagination: {
      current: 1,
      pageSize: 10
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { initialPagination } = this.state;
    dispatch({
      type: "authority/fetch_account_list",
      payload: {
        limit: initialPagination.pageSize,
        offset: initialPagination.current
      },
    });
  };

  columns = [{
    title: "序号",
    dataIndex: "id"
  }, {
    title: "账号名称",
    dataIndex: "nickname"
  }, {
    title: "角色",
    dataIndex: "authority_list",
    render:(text,record) =>{
      if(!record.authority_list.length){
        return '-'
      }else{
        let roleStr = ''
        record.authority_list.map(item=>{
          roleStr += `${item.authority_name},`
        })
        return roleStr
      }
    },
  }, {
    title: "手机号码",
    dataIndex: "mobile"
  }, {
    title: "账号状态",
    dataIndex: "status",
    render: (text, record) => (
      <Button type={record.status === 0 ? "primary" : ""}>{record.status === 0 ? "关闭" : "开启"}</Button>
    )
  }, {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleRoles(true,record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.checkUserRole(record.id)}>查看账号权限</a>
        </Fragment>
      )
    }
  ];

  // 角色分配弹窗

  /* 列表操作相关 */

  // 分配角色权限
  handleRoles = (flag,rowInfo) => {
    const { dispatch, authority, } =  this.props;
    const { roleLists} =  this.state;

    if(rowInfo){
     //获取角色列表及当前账号已有角色数据

      // 处理当前账号已有的角色数据
      let curAccountRoleList = [] ;
      if(rowInfo.authority_list.length){
        rowInfo.authority_list.map(item=>{
          curAccountRoleList.push(item.authority_id);
        })
      }
      this.setState({
        roleInitialLists:curAccountRoleList,
        rowInfo:rowInfo,
      });
      if(!roleLists.length){
        new Promise(resolve =>{
          dispatch({
            type:'authority/fetch_role_list',
            payload:{
              resolve
            },
          })
        }).then((res)=>{
          if(res.state === 1){
            this.setState({
              roleLists:res.data.rows,
              modalVisible: !!flag
            });
          }else{
            message.error(res.msg);
          }
        });// 请求所有角色数据
      }else{
        this.setState({
          modalVisible: !!flag
        });
      }
    }else{
      this.setState({
        modalVisible: !!flag
      });
    }
  };

  // 查看用户详细功能
  checkUserRole = (id) => {
    localStorage.setItem("accountAuthorityDetail", id);
    router.push("/authority/account_detail");
  };

  // 控制分配角色弹窗显示隐藏
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag
    });
  };

  // 分配角色给账号
  dispatchRoleToAccount = (params) =>{
    const { dispatch, authority } = this.props;
    const { rowInfo ,initialPagination} = this.state;
    new Promise(resolve=>{
      dispatch({
        type:'authority/dispatch_role_to_account',
        payload:{
          params:{
            partner_id:rowInfo.id,
            authority_id_list:params.roleListItem,
          },
          resolve
        },
      });
    }).then(res=>{
      if(res.state===1){
        if(res.state ===1){
          message.success('分配角色成功');
          this.handleModalVisible();
          // 刷新列表
          dispatch({
            type: "authority/fetch_account_list",
            payload: {
              limit: authority.accountData.data.pagination.page_size || initialPagination.pageSize,
              offset: authority.accountData.data.pagination.current || initialPagination.current,
            },
          })

        }else {
          message.error(res.msg);
        }
      }
    });

  };

  /*
  * 创建账号相关操作
  * */

  // 控制创建账号弹窗
  createAccountHandleModal = (flag) =>{
    this.setState({
      createModalVisible:!!flag,
      createAccountData:{
        nickname:'',
        password:'',
        mobile:''
      }
    });
  };

  // 创建顶级代理商确定事件
  submitCreateAccount = (fieldValue) =>{
    const { dispatch, authority:{ saveCreateAccount,accountData } } = this.props;
    const { initialPagination } = this.state;
    dispatch({
      type:'authority/create_top_account',
      payload:{
        nickname: fieldValue.nickname,
        password: fieldValue.password,
        mobile: fieldValue.mobile,
      }
    }).then(()=>{
      if(saveCreateAccount.state === 1){
        message.success('创建账号成功');
        this.createAccountHandleModal(false);
        // 刷新列表
        dispatch({
          type: "authority/fetch_account_list",
          payload: {
            limit: accountData.data.pagination.page_size || initialPagination.pageSize,
            offset: 1
          },
        });
      }else {
        console.log(saveCreateAccount);
        message.error(saveCreateAccount.msg);
      }
    })
  };

  // 创建顶级代理商账号
  createTopPartner = () =>{
    this.createAccountHandleModal(true);
  };

  // 创建账号按钮dom接口
  createTopButton(){
    return (
      <Button type="primary" onClick={this.createTopPartner}>创建顶级代理商</Button>
    )
  };

  // 创建账号
  renderCreateButton(){
    let currentUser = JSON.parse(localStorage.getItem('userInfo')),
        curLoginAccountId = currentUser.authority_list[0].authority_id;
    if(curLoginAccountId === 1){
      return this.createTopButton()
    }else{
      return ''
    }
  };


  /*dom结构渲染*/
  render() {
    const { authority: { accountData }, tableLoading } = this.props;
    const { selectedRows, roleLists, roleInitialLists, modalVisible } = this.state;

    // 分配角色参数数据
    const dispatchMethod = {
      handleAdd: this.dispatchRoleToAccount,
      handleModalVisible: this.handleModalVisible,
      editRoleData: this.state.editRoleData,
      roleLists: roleLists,
      roleInitialLists: roleInitialLists
    };

    // 创建账号相关参数
    const createAccountParams = {
      modalVisible:this.state.createModalVisible,
      handleModalVisible:this.createAccountHandleModal,
      submitCreateAccount:this.submitCreateAccount,
      createAccountData:this.state.createAccountData,
    };

    return (
      <PageHeaderWrapper title="账号设置">
        <Card>
          <div>{this.renderCreateButton()}</div>
          <StandardTable
            selectedRows={selectedRows}
            loading={tableLoading}
            data={accountData.data}
            columns={this.columns}
          />

          {/*分配权限*/}
          <DispatchRoleModal {...dispatchMethod} modalVisible={modalVisible}/>

          {/*创建账号*/}
          <CreateTopPartner {...createAccountParams}/>

        </Card>
      </PageHeaderWrapper>
    );

  }
}

export default account_setting;
