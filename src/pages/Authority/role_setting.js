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
const { TreeNode } = Tree;

// 新增或编辑角色
const ManipulationRole = Form.create()((props) => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    editRoleData
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      handleAdd(fieldValue);
    });
  };
  return (
    <Modal
      title={editRoleData.isEdit ? "编辑角色" : "创建角色"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator("name", {
          initialValue: editRoleData.name,
          rules: [{
            required: true,
            message: "请输入角色名称"
          }]
        })(<Input placeholder="请输入角色名称"/>)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色描述">
        {form.getFieldDecorator("description", {
          initialValue: editRoleData.description,
          rules: [{ required: true, message: "请输入角色描述" }]
        })(<Input placeholder="请输入角色描述"/>)}
      </FormItem>

    </Modal>
  );
});
const DispatchAuthority = Form.create()((props) => {
  const state = {
    checkedKeys: [],
    expandedKeys: [],
    selectedKeys: []
  };

  const {
    menuData,
    showAuthorityModal,
    hideDispatchAuthorityModal,
    defaultSelectedKeys,
    onCheck,
    submitAuthoritySetting
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
          key={item.menu_id}>
          {getNavMenuItems(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.menu_id} isLeaf/>;
  };

  // 权限分配相关操作
  const onExpand = (expandedKeys, e) => {
    console.log("onExpand", expandedKeys);
    console.log(e);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("onSelect", info);
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
        selectable={false}
      >
        {getNavMenuItems(menuData)}
      </Tree>
    </Modal>
  );

});

@Form.create()

@connect(({ menu, authority, user, loading }) => ({
  menuData: menu.menuData,
  authority,
  userInfo: user.currentUser,
  loading: loading
}))

// 分配权限

class roleSetting extends Component {
  state = {
    /*
    * 角色编辑相关参数
    * */
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    // 编辑权限相关参数
    editRoleData: {
      name: "",
      description: "",
      isEdit: false
    },
    /*
    * 权限分配相关参数
    * */
    subNodeList: null, // 后台结束菜单id合集
    selectedRoleMenudIdList: [],// 当前选中角色所所拥有权限的id
    showAuthorityModal: false,
    defaultSelectedKeys: [],
    roleListSelectedRow: {},
    /*
    * 表格数据
    * */
    initialPagination: {
      current: 1,
      pageSize: 10
    }
  };

  columns = [{
    dataIndex: "id",
    title: "ID"
  }, {
    dataIndex: "name",
    title: "角色名称"
  }, {
    dataIndex: "description",
    title: "角色描述"
  }, {
    dataIndex: "count",
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
        <a onClick={() => this.checkRolePartnerDetail(record)}>查看</a>
      </Fragment>
    )
  }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { initialPagination } = this.state;
    dispatch({
      type: "authority/fetch_role_list",
      payload: {
        params: {
          limit: initialPagination.pageSize,
          offset: initialPagination.current
        }
      }
    });
  }

  /*
  * 列表相关操作
  * */
  // refreshTable
  refreshTable = (isFirstPage) => {
    const { dispatch } = this.props;
    const { initialPagination } = this.state;
    const { authority } = this.props;
    let pageSize = authority.roleData.data.pagination.page_size ? authority.roleData.data.pagination.page_size : initialPagination.pageSize,
        current = isFirstPage ? 1 : authority.roleData.data.pagination.current;
    dispatch({
      type: "authority/fetch_role_list",
      payload: {
        params: {
          limit: pageSize,
          offset: current,
        }
      }
    });
  };

  // 分配权限Modal
  showAuthorityModal = (flag, data) => {
    if (data) {
      this.setState({
        roleListSelectedRow: data,
        selectedRoleMenudIdList: []
      });
      const { dispatch } = this.props;

      dispatch({
        type: "authority/fetch_curRole_authority",
        payload: {
          authority_id: data.id
        },
        callback: (res) => {
          let menuIdList = [];
          if (res.state === 1) {
            if (res.data.length) {
              this.getItem(res.data);
              menuIdList = this.state.selectedRoleMenudIdList.map(item => item.menu_id);
              this.setState({
                defaultSelectedKeys: menuIdList
              });
            }
            this.setState({
              showAuthorityModal: !!flag
            });

          } else {
            message.error(res.msg);
          }
        }
      });
      // 获取当前角色权限
    } else {
      this.setState({
        showAuthorityModal: !!flag
      });
    }
  };

  // 移除角色
  removeRole = (params) => {
    const { dispatch } = this.props;
    let _this = this;

    const modal = Modal.confirm({
      title: "操作",
      content: `是否移除此'${params.name}'这个角色？`,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "authority/delete_role",
            payload: {
              params: {
                authority_id: params.id,
              },
              resolve,
            }
          });
        }).then(res => {
          if (res.state === 1) {
            modal.destroy();
            message.success("删除角色成功");
            // 刷新表格
            _this.refreshTable();
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  };

  // 查看详情
  checkRolePartnerDetail = (rowInfo) => {
    if(rowInfo.count === 0){
      message.success('此角色下暂无代理商');
      return
    }else{
      localStorage.setItem("rolePartnerDetail", JSON.stringify({
        name: rowInfo.name,
        id: rowInfo.id
      }));
      router.push("/authority/role_detail");
    }
  };

  // 表格操作变化变化
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      offset: pagination.current,
      limit: pagination.pageSize,
      ...formValues
    };

    dispatch({
      type: "authority/fetch_role_list",
      payload: {
        params: params
      }
    });
  };
  /*
  * flag 是否显示弹窗
  * data 需要修改的数据
  * isEdit 当前为修改数据还是新增数据 1：修改数据 2：新增数据
  * */
  handleModalVisible = (flag, data) => {
    const { form } = this.props;
    if (flag && data) {
      this.setState({
        editRoleData: { ...data, isEdit: true }
      });
    } else {
      form.resetFields({
        name:'',
        description:''
      });
      this.setState({
        editRoleData: { name: "", description: "", isEdit: false }
      });
      console.log(111);
    }
    this.setState({
      modalVisible: !!flag
    });
  };

  // 创建或修改角色
  handleAdd = fields => {
    const { dispatch } = this.props;
    const { editRoleData } = this.state;
    let _this = this;
    // 创建（编辑）角色
    if (editRoleData.isEdit) {
      // 编辑角色
      new Promise(resolve => {
        dispatch({
          type: "authority/edit_role",
          payload: {
            params: {
              authority_id: editRoleData.id,
              description: fields.description,
              name: fields.name
            },
            resolve
          }
        });
      }).then(res => {
        if (res.state === 1) {
          message.success("修改数据成功");
          _this.handleModalVisible();
          // 刷新表格
          _this.refreshTable();
        } else {
          message.error(res.msg);
        }
      });

    } else {
      // 新增角色
      new Promise(resolve => {
        dispatch({
          type: "authority/add_role",
          payload: {
            params: {
              name: fields.name,
              description: fields.description
            },
            resolve
          }
        });
      }).then(res => {
        if (res.state === 1) {
          message.success("添加成功");
          _this.handleModalVisible();
          // 刷新表格
          _this.refreshTable(true);
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  // 给角色分配权限选择
  onCheck = (checkedKeys, e) => {
    let regMainNode = /^(\d-\d)?$/,
      menuInfoList = e.checkedNodesPositions,
      mainNodeList = [], // 主节点id合集
      subNodeList = []; // 子节点id合集

    menuInfoList.map((item, index) => {
      if (regMainNode.test(item.pos)) {
        mainNodeList.push(item.node.key);
      }
    });

    subNodeList = mainNodeList.concat(checkedKeys).filter(v => !mainNodeList.includes(v)).map(item => parseInt(item));

    this.setState({
      defaultSelectedKeys: checkedKeys,
      subNodeList: subNodeList
    });
  };

  // 分配权限确定
  submitAuthoritySetting = () => {
    const { dispatch } = this.props;
    const { roleListSelectedRow, subNodeList } = this.state;
    // 提交权限表单
    dispatch({
      type: "authority/dispatch_authority_to_role",
      payload: {
        authority_id: roleListSelectedRow.id,
        menu_id_list: subNodeList
      },
      callback: (res) => {
        if (res.state === 1) {
          message.success("分配权限成功");
          this.showAuthorityModal(false);
        } else {
          message.error(res.msg);
        }
      }
    });
  };

  // 获取当前角色已有权限---扁平化数组
  getItem = (data) => {
    data.map(item => {
      if (!item.children) {
        this.state.selectedRoleMenudIdList.push(item);
      } else {
        this.state.selectedRoleMenudIdList.push(item);
        this.getItem(item.children);
      }
    });
  };

  render() {
    const {
      authority: { roleData },
      loading,
      menuData
    } = this.props;

    const { modalVisible, defaultSelectedKeys } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      editRoleData: this.state.editRoleData
    };

    const dispatchAuthorityMethods = {
      showAuthorityModal: this.state.showAuthorityModal, //显隐菜单
      menuData: menuData, // 菜单数据
      defaultSelectedKeys: defaultSelectedKeys, // 权限选中数据
      hideDispatchAuthorityModal: this.showAuthorityModal, // 关闭弹窗
      onCheck: this.onCheck, //权限选择操作
      submitAuthoritySetting: this.submitAuthoritySetting// 提交表单
    };

    const tableLoading = {
      loading: loading.effects["authority/fetch_role_list"]
    }; // 表格加载loading

    return (
      <PageHeaderWrapper title="角色设置">
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={() => this.handleModalVisible(true)}>添加角色</Button>
          </div>
          <StandardTable
            loading={tableLoading.loading}
            data={roleData.data}
            selectedRows={[]}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
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

