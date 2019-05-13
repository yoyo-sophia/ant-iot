import React, { Component, PureComponent, Fragment } from "react";
import { connect } from "dva";
import router from "umi/router";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Modal,
  Divider,
  Button,
  message,
  Tree
} from "antd";

import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";


const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = Tree;
const confirm = Modal.confirm;

// 新增或编辑角色
const ManipulationRole = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible, editRoleData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldValue);
    });
  };
  return (
    <Modal
      title={editRoleData.isEdit === 1 ? "编辑角色" : "创建角色"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator("name", {
          initialValue: editRoleData.name,
          rules: [{ required: true, message: "请输入至少五个字符的规则描述！", min: 5 }]
        })(<Input placeholder="请输入角色名称"/>)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色描述">
        {form.getFieldDecorator("describe", {
          initialValue: editRoleData.describe,
          rules: [{ required: true, message: "请输入至少五个字符的规则描述！", min: 5 }]
        })(<Input placeholder="请输入角色描述"/>)}
      </FormItem>

    </Modal>
  );
});

// 分配权限
const DispatchAuthority = (props) => {
  const state = {
    checkedKeys: [],
    expandedKeys: [],
    selectedKeys: []
  };

  const {
    menuData,
    showAuthorityModal,
    confirmDispatchAuthority,
    hideDispatchAuthorityModal,
    defaultSelectedKeys
  } = props;

  // 循环创建菜单权限列表
  const getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => getSubMenuOrItem(item, parent))
      .filter(item => item);
  };

  const getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && item.children.some(child => child.name)) {
      return (
        <TreeNode
          title={item.name}
          key={item.path}>
          {getNavMenuItems(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.path} isLeaf/>;
  };

  // 权限分配相关操作
  const onExpand = (expandedKeys, e) => {
    console.log("onExpand", expandedKeys);
    console.log(e);

  };

  const onCheck = (checkedKeys, e) => {
    console.log("onCheck", checkedKeys);
    console.log(e);
    state.checkedKeys = checkedKeys;
  };

  const onSelect = (selectedKeys, info) => {
    console.log("onSelect", info);
  };

  const submitAuthoritySetting = () => {

    // hideDispatchAuthorityModal(false);
  };

  return (
    <Modal
      visible={showAuthorityModal}
      title="分配权限"
      onOk={submitAuthoritySetting}
      onCancel={() => hideDispatchAuthorityModal(false)}
    >
      <Tree
        checkable
        checkedKeys={defaultSelectedKeys}
        onExpand={onExpand}
        onCheck={onCheck}
        onSelect={onSelect}
        selectable={false}
      >
        {getNavMenuItems(menuData)}
      </Tree>
    </Modal>
  );

};


@connect(({ menu, authority, user,loading }) => ({
  menuData: menu.menuData,
  authority,
  userInfo:user.currentUser,
  loading: loading.models.authority
}))


class roleSetting extends Component {
  state = {
    /*
    * 角色编辑相关参数
    * */
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    // 编辑权限相关参数
    editRoleModal: false,
    editRoleData: {
      name: "",
      describe: "",
      isEdit: 1
    },
    /*
    * 权限分配相关参数
    * */
    showAuthorityModal: false,
    defaultSelectedKeys: null,
  };

  columns = [
    {
      dataIndex: "id",
      title: "ID"
    }, {
      dataIndex: "name",
      title: "角色名称"
    }, {
      dataIndex: "describe",
      title: "角色描述"
    }, {
      dataIndex: "role_partners",
      title: "角色成员数量"
    }, {
      // dataIndex:'operate',
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showAuthorityModal(true, record)}>分配权限</a>
          <Divider type="vertical"/>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.removeRole(record)}>移除</a>
          <Divider type="vertical"/>
          <a onClick={() => this.checkRolePartnerDetail(record.id)}>查看</a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch,userInfo } = this.props;
    dispatch({
      type: "authority/fetch_role_list",
      payload:{
        authority_id:userInfo.authority_list[0].authority_id
      }
    });
  }

  /*
  * 列表相关操作
  * */

  // 分配权限Modal
  showAuthorityModal = (flag, data) => {

    if (data) {
      const { dispatch } = this.props;
      dispatch({
        type: "authority/fetch_curRole_authority",
        payload:{
          id:data.id
        },
        callback: (res) => {
          if (res.state === 1) {
            this.setState({
              defaultSelectedKeys: res.data
            })
          }else{
            message.error(res.msg)
          }
        }
      });
      // 获取当前角色权限

    }

    this.setState({
      showAuthorityModal: !!flag
    });

  };

  // 移除角色
  removeRole = (params) => {
    const { authority: { deleteRole }, dispatch } = this.props;
    confirm({
      title: "操作",
      content: `是否移除此'${params.name}'这个角色？`,
      okText: "确认",
      cancelText: "取消",
      onOk() {

        dispatch({
          type: "authority/delete_role",
          payload: {
            id: params.id
          },
          callback: (res) => {
            console.log(res);
          }
        });

        // return new Promise((resolve, reject) =>{
        //   console.log(curDeleteRole);
        //   if(deleteRole.state==1){
        //     message.success("移除角色成功");
        //     resolve('ok');
        //   }else{
        //     message.error(deleteRole.msg);
        //     reject(deleteRole);
        //   }
        // });
      },
      onCancel() {
      }
    });
  };

  // 查看详情
  checkRolePartnerDetail = (id) => {
    localStorage.setItem("rolePartnerDetailId", id);
    router.push("/authority/role_detail");
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState({
        formValues: values
      });

      dispatch({
        type: "rule/fectch",
        payload: values
      });
    });
  };

  /*
  * flag 是否显示弹窗
  * data 需要修改的数据
  * isEdit 当前为修改数据还是新增数据 1：修改数据 2：新增数据
  * */
  handleModalVisible = (flag, data) => {
    if (flag && data) {
      this.setState({
        editRoleData: { ...data, isEdit: 1 }
      });
    } else {
      this.setState({
        editRoleData: { name: "", describe: "", isEdit: 0 }
      });
    }
    this.setState({
      modalVisible: !!flag
    });
  };

  // 编辑弹窗 控制
  handleEditModal = flag => {
    this.setState({
      editRoleModal: !!flag
    });
  };

  // 创建或修改角色
  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleData } = this.state;
    let _this = this;

    console.log(fields);

    // 创建（编辑）角色
    if(editRoleData.isEdit === 1){
      // 编辑角色


    }else if(editRoleData.isEdit === 2){
      // 新增角色
      dispatch({
        type: "rule/add",
        payload: {
          desc: fields.desc,
          name: fields.name
        },
        callback:(res)=>{
          if(res.state===1){
            _this.handleModalVisible();
            message.success("添加成功");
          }else{
            message.error(res.msg);
          }
        }
      });
    }



  };

  render() {
    const {
      authority: { roleData },
      loading,
      menuData
    } = this.props;

    const { modalVisible, editRoleModal, defaultSelectedKeys } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      editRoleData: this.state.editRoleData
    };

    const dispatchAuthorityMethods = {
      showAuthorityModal: this.state.showAuthorityModal, //显隐菜单
      menuData: menuData, // 菜单数据
      defaultSelectedKeys: defaultSelectedKeys, // 权限选中数据
      handleEditModal: this.handleEditModal,
      handleModalVisible: this.handleModalVisible,
      hideDispatchAuthorityModal: this.showAuthorityModal
    };

    return (
      <PageHeaderWrapper title="角色设置">
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={() => this.handleModalVisible(true)}>添加角色</Button>
          </div>
          <StandardTable
            loading={loading}
            data={roleData}
            selectedRows={[]}
            columns={this.columns}
          />

          {/*编辑角色*/}
          <ManipulationRole {...parentMethods} modalVisible={modalVisible}/>

          {/*给角色分配权限*/}
          <DispatchAuthority {...dispatchAuthorityMethods}  />

        </Card>
      </PageHeaderWrapper>
    );

  }

}

export default roleSetting;

