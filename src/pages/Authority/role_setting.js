import React, {Component, PureComponent, Fragment } from "react";
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
  Tree,
} from "antd";

import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";


const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = Tree;
const confirm = Modal.confirm;

// 新增或编辑角色
const ManipulationRole = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible ,editRoleData} = props;
  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldValue);
    });
  };
  return(
    <Modal
      title={editRoleData.isEdit===1?'编辑角色':'创建角色'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={()=>handleModalVisible()}
    >
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          initialValue:editRoleData.name,
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入角色名称" />)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色描述">
        {form.getFieldDecorator('describe', {
          initialValue:editRoleData.describe,
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入角色描述" />)}
      </FormItem>

    </Modal>
  )
});



@connect(({ menu: menuModel,authority, loading }) => ({
  menuData: menuModel.menuData,
  authority,
  loading: loading.models.authority,
}))


class roleSetting extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    // 编辑权限相关参数
    editRoleModal: false,
    editRoleData:{
      name:'',
      describe:'',
      isEdit:1,
    },
    checkedKeys: ['0-0-0'],
    expandedKeys: [],
    selectedKeys: [],
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
          <a onClick={()=>this.handleEditModal(true)}>分配权限</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.handleModalVisible(true,record,1)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={()=>this.removeRole(record)}>移除</a>
          <Divider type="vertical"/>
          <a onClick={() => this.checkRolePartnerDetail(record.id)}>查看</a>
        </Fragment>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authority/fetch_role_list',
    });
  }

  /*
  * 列表相关操作
  * */

  // 分配权限Modal

  // 移除角色
  removeRole = (params) =>{
    const { authority:{deleteRole}, dispatch,} = this.props;
    confirm({
      title:'操作',
      content: `是否移除此'${params.name}'这个角色？`,
      okText: '确认',
      cancelText: '取消',
      onOk(){

        dispatch({
          type:'authority/delete_role',
          payload:{
            id:params.id
          },
          callback:(res)=>{
            console.log(res);
          }
        })

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
      onCancel(){},
    })
  };

  // 查看详情
  checkRolePartnerDetail = (id) =>{
    localStorage.setItem('rolePartnerDetailId',id);
    router.push("/authority/role_detail");
  };

  // 循环创建菜单权限列表
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && item.children.some(child => child.name)) {
      return (
        <TreeNode
          title={item.name}
          key={item.path}>
          {this.getNavMenuItems(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.path} isLeaf/>;
  };

  // 权限分配相关操作
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  // 重置表单
  handleFormRest = () => {
    const {form ,dispatch } = this.props;

    form.resetFields();

    this.setValues({
      formValues: {}
    });

    dispatch({
      type: "rule/fetch",
      payload: {}
    });
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
  * isEdit 当前为修改数据还是新增数据
  * */
  handleModalVisible = (flag,data,isEdit) => {

    if(flag && data){
      this.setState({
        editRoleData:{
          ...data,
          isEdit:1,
        }
      })
    }else{
      this.setState({
        editRoleData:{
          name:'',
          describe:'',
          isEdit:0,
        },
      })
    }
    this.setState({
      modalVisible: !!flag
    });
  };

  handleEditModal = flag =>{
    this.setState({
      editRoleModal: !!flag
    })
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "rule/add",
      payload: {
        desc: fields.desc
      }
    });
    message.success("添加成功");
    this.handleModalVisible();
  };

  // 分配权限Modal
  handleEditRole = ()=>{
    message.success("编辑权限成功");
    this.handleEditModal();
  }
  // 渲染菜单列表
  RenderRoleList(methods){
    const {editRoleModal } = this.state;
    const {menuData} = this.props;

    return (
      <Modal
        visible={editRoleModal}
        destroyOnClose
        title="分配权限"
        onOk={this.handleEditRole}
        onCancel={methods.handleEditModal}
      >
        <Tree
          checkable
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          selectkeys={this.state.selectedKeys}
          onSelect={this.onSelect}
        >
          {this.getNavMenuItems(menuData)}
        </Tree>
      </Modal>
    )
  }

  render() {
    const {
      authority: { roleData },
      loading,
      menuData,
    } = this.props;

    const { selectedRows, modalVisible, editRoleModal , updateModalVisible, setFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      editRoleData : this.state.editRoleData

    };

    const editRoleMethods = {
      handleEditModal : this.handleEditModal,

    }

    return (
      <PageHeaderWrapper title="角色设置">
        <Card bordered={false}>
          <div>
            <Button type="primary" onClick={()=>this.handleModalVisible(true)}>添加角色</Button>
          </div>
          <StandardTable
            loading={loading}
            data={roleData}
            selectedRows={[]}
            columns={this.columns}
          />
          <ManipulationRole {...parentMethods} modalVisible={modalVisible} />
          {this.RenderRoleList(editRoleMethods)}
        </Card>
      </PageHeaderWrapper>
    );

  }

}
export default roleSetting;

