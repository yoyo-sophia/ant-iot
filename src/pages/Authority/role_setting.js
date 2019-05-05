// 角色设置
import React, {Component, PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
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
// import BaseMenu from "../../components/SiderMenu/BaseMenu";


const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = Tree;

// 新增角色Modal
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible ,editRoleData} = props;
  // const {editRoleData} =
  const okHandle = () => {
    form.validateFields((err, fieldValue) => {
      if (err) return;
      form.resetFields();
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          initialValue:editRoleData.name,
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入角色名称" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色描述">
        {form.getFieldDecorator('desc', {
          initialValue:editRoleData.desc,
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入角色描述" />)}
      </FormItem>

    </Modal>
  )
});

// 编辑权限Modal

// 是否移除该角色Modal

// 查看详情 跳转页面


// 创建表格

@connect(({ menu: menuModel,rule, loading }) => ({
  menuData: menuModel.menuData,
  rule,
  loading: loading.models.rule,
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
      desc:''
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
          <a onClick={()=>this.handleModalVisible(true,record)}>编辑</a>
          <Divider type="vertical"/>
          <a>移除</a>
          <Divider type="vertical"/>
          <a>查看</a>
        </Fragment>
      )
    }
  ];

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
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

  componentDidMount() {
    // 请求数据
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
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

  handleModalVisible = (flag,data) => {

    if(flag && data){
      // this.props.form.setFieldsValue({
      //   name: data.name,
      //   desc:data.desc,
      // })

      this.setState({
        editRoleData:data
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

  // 渲染Form的dom结构
  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator("name")(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Button type="primary" htmlType="submit">查询</Button>
        </Row>
      </Form>
    );
  }

  // 分配权限Modal

  handleEditRole = ()=>{
    message.success("编辑权限成功");
    this.handleEditModal();
  }
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
      rule: { data },
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


    const dispatchRole = {
      // handleModalVisible: this.handleModalVisible,
    }

    const updateMethods = {};

    return (
      <PageHeaderWrapper title="角色设置">
        <Card bordered={false}>
          {/*<div>{this.renderSimpleForm()}</div>*/}
          <div>
            <Button type="primary" onClick={()=>this.handleModalVisible(true)}>增加</Button>
          </div>
          <StandardTable
            loading={loading}
            data={data}
            selectedRows={[]}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
          {this.RenderRoleList(editRoleMethods)}
        </Card>
      </PageHeaderWrapper>
    );

  }

}

// roleSetting = Form.create({})(roleSetting)
// export default roleSetting;


export default roleSetting;

