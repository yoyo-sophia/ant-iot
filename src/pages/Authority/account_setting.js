import React, { Component ,Fragment} from "react";
import { connect } from "dva";
import { Row, Col, Tree, Card, Form, Input, Button ,Divider, Checkbox,Modal} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';

const FormItem = Form.Item;

// 分配角色权限
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible ,roleLists, roleInitialLists} = props;

  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldValue);
    });
  };
  return(
    <Modal
      destroyOnClose
      title="创建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={()=>handleModalVisible()}
    >

      <FormItem label="角色列表">
        {
          form.getFieldDecorator('roleListItem',{
            initialValue:roleInitialLists,
          })(
            <Checkbox.Group style={{width:"100%"}}>
              <Row>
              {
                roleLists.map((item,index)=>{
                  return (
                      <Col key={index} span={8}>
                        <Checkbox value={item.id} >{item.name}</Checkbox>
                      </Col>
                  )
                })
              }
              </Row>
            </Checkbox.Group>
          )
        }
      </FormItem>
    </Modal>
  )
});

@Form.create()

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority
}))

class account_setting extends Component {

  state = {
    list: [],
    selectedRows: [],
    dispatchRole:false,
    roleLists:[{
      id: 1,
      name: '代理商',
    },{
      id:2,
      name: '财务',
    },{
      id:3,
      name:'客服'
    }],
    roleInitialLists:[1,3],

    // 列表弹窗操作相关内容
    confirmLoading:false, // 异步确定关闭弹窗
    modalVisible: false, // 是否显示弹窗
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "authority/fetch"
      // payload: {  },
    });
  }

  componentWillMount() {

  }

  columns = [{
    title: '序号',
    dataIndex: 'id',
  }, {
      title: '账号名称',
      dataIndex: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
    }, {
      title: '手机号码',
      dataIndex: 'phone',
    }, {
      title: '账号状态',
      dataIndex: 'status',
      render: (text, record) => (
        <Button type={ record.status === 0 ? 'primary':'' }>{record.status === 0 ? '关闭':'开启'}</Button>
      )
    }
    ,{
      // dataIndex:'operate',
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={()=>this.handleRoles(true)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.checkUserRole(record.id)}>查看账号权限</a>
        </Fragment>
      )
    }
  ];


  // 角色分配弹窗

  /* 列表操作相关 */

  // 分配角色权限
  handleRoles = (flag) =>{
    this.setState({
      modalVisible: !!flag
    })
  };

  renderAllRoles = (data) =>{
    data.map((item,index)=>{
      return (
        <Checkbox value={item.id}>{item.name}</Checkbox>
      )
    })
  }


  /*
  * type:操作类型 1:分配权限 2:移除权限 3:移除用户
  * data:与操作类型相关的数据
  * */

  /*
  * type:1
  * */

  manipulationAuthority = (type,data) =>{

    const { modalVisible,roleLists }  = this.state;

    if(type===1){

    }
    return(
      <Modal
        destroyOnClose
        title="创建角色"
        visible={modalVisible}
        // onOk={okHandle}
        // onCancel={()=>handleModalVisible()}
      >
        {/*<p>是否移除此账号</p>*/}
        <div>
          {this.renderAllRoles(roleLists)}
        </div>

      </Modal>
    )
  }


  // 查看用户详细功能
  checkUserRole = (id) =>{
    localStorage.setItem('accountAuthorityDetail',id);
    router.push('/authority/account_detail')
  };

  // 控制弹窗显示隐藏

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag
    });
  };

  // 角色列表

  render_roles_list(){
    return this.state.roleLists.map((item,index)=>{
      return (
        <div key={index}>
          <Checkbox
            defaultChecked={item.id}
            // checked={item.id}
          >
            {item.name}
          </Checkbox>
        </div>
      )
    })
  }

  /*dom结构渲染*/
  render() {
    const { authority: { data }, loading} = this.props;
    const {selectedRows,roleLists,roleInitialLists,modalVisible} = this.state;

    // 分配角色参数数据
    const dispatchMethod = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      editRoleData : this.state.editRoleData,
      roleLists:roleLists,
      roleInitialLists:roleInitialLists,
    };

    return (
      <PageHeaderWrapper title="账号设置">
        <Card>
          {/*<div>{this.render_roles_list()}</div>*/}
          {/*<Button onClick={this.test_click.bind(this)}>获取选中代理商</Button>*/}
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            // onSelectRow={this.handleSelectRows}
            // onChange={this.handleStandardTableChange}
          />
         <CreateForm {...dispatchMethod} modalVisible={modalVisible} />
        </Card>
      </PageHeaderWrapper>
    );

  }
}

export default account_setting;
