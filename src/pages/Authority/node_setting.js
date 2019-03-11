import React, { Component } from "react";
import { connect } from "dva";
import { Row, Col, Tree, Card, Form, Input, Radio, Button } from "antd";

import PageHeaderWrapper from "@/components/PageHeaderWrapper";

import style from "./css/node-setting.less";

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

@connect(({ menu: menuModel, authority, loading }) => ({
  authority,
  menuData: menuModel.menuData
}))


class node_setting extends Component {
  state = {
    currentNodeIndex: "",
    nodeList: [],
    node_radio_data:{
      menu:1,
      role:1,
      status:1
    },
    newMenuList:[],
  };
  componentDidMount() {


    // dispatch({
    //   type: 'menu/getMenuData',
    //   payload: { routes, authority },
    // });

  }

  componentWillMount() {

  }

  /*业务处理*/

  /*
  * 循环获取菜单节点结构
  * */

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
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

  // 扁平化菜单数据
  getItem = (data)=>{
    data.map(item=>{
      if(!item.children){
        this.state.newMenuList.push(item)
      }else{
        this.state.newMenuList.push(item);
        this.getItem(item.children);
      }
    })
  }


  /*
  * 提交节点设置
  * */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Recevied values of form", values);
      }
    });
  };

  /*
  *
  * */

  onSelect = (selectedKeys) => {

    let choose_menu_data = {};

    this.state.newMenuList
      .map(item=>{
        if(selectedKeys[0]==item.path){
            choose_menu_data = item
        }
      })

    this.props.form.setFieldsValue({
      node_url: choose_menu_data.path,
      node_name:choose_menu_data.name,
      node_icon : choose_menu_data.icon ? choose_menu_data.icon:'',
    })

  };

  onExpand = () => {

  };


  /*dom结构渲染*/
  render() {
    const { nodeList, currentNodeIndex } = this.state;
    const { authority, menuData } = this.props;

    // 将嵌套菜单数据扁平化
    this.getItem(menuData);

    // 表单
    const { getFieldDecorator,setFieldsValue } = this.props.form;

    // this.props.form.setFieldsValue({
    //     "is_menu":this.state.node_radio_data.menu,
    //     "node_role":this.state.node_radio_data.role,
    //     "node_state":this.state.node_radio_data.status
    // })

    // FormLayout
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    /*新增节点*/
    const newNode = () => {

    };

    /*删除节点*/
    const deleteNode = () => {

    };



    return (
      <PageHeaderWrapper title="节点设置">
        <Card bordered={false} className={style["node-setting"]}>
          <Row gutter={24}>
            <Col span={8}>
              <div className={style["tree-node-wrap"]}>
                <p className={style.title}>节点列表</p>
                <div className={style["operation-wrap"]}>
                  <span onClick={newNode}>新增节点</span>
                  <span onClick={deleteNode}>删除节点</span>
                </div>
              </div>

              <DirectoryTree
                multiple
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                switcherIcon=''
              >
                {this.getNavMenuItems(menuData)}
              </DirectoryTree>

            </Col>
            <Col span={16}>
              <Form onSubmit={this.handleSubmit}>

                <Form.Item {...formItemLayout} label="节点名称">
                  {getFieldDecorator('node_name', {
                    rules: [{
                      required: true,
                      message: '请输入节点名称',
                    },{
                      min:2,
                      max:10,
                      message:'字符长度为2-10'
                    }],
                  })(
                    <Input placeholder="请填写节点名称" />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="节点地址">
                  {getFieldDecorator('node_url', {
                    rules: [{
                      required: true,
                      message: '请输入节点地址',
                    }],
                  })(
                    <Input placeholder="请输入节点地址" />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="节点排序">
                  {getFieldDecorator('node_sort', {
                    rules: [{
                      required: true,
                      message: '请输入节点排序',
                    }],
                  })(
                    <Input placeholder="请输入节点排序" />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="节点图标">
                  {getFieldDecorator('node_icon', {
                    rules: [{
                      // required: true,
                      message: '请输入图标名',
                    }],
                  })(
                    <Input placeholder="请输入图标名" />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="菜单">
                  {getFieldDecorator('is_menu',{
                    initialValue:this.state.node_radio_data.menu
                  })(
                    <Radio.Group>
                    {/*<Radio.Group defaultValue={this.state.node_radio_data.menu}>*/}
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="层级">
                  {getFieldDecorator('node_role',{
                    initialValue:this.state.node_radio_data.role
                  })(
                    <Radio.Group>
                    {/*<Radio.Group defaultValue={this.state.node_radio_data.role}>*/}
                      <Radio value={1}>主节点</Radio>
                      <Radio value={2}>子节点</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator('node_state',{
                    initialValue:this.state.node_radio_data.status
                  })(
                    <Radio.Group>
                    {/*<Radio.Group defaultValue={this.state.node_radio_data.status}>*/}
                      <Radio value={1}>开启</Radio>
                      <Radio value={2}>关闭</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>

                <Form.Item wrapperCol={{ span: 14, offset: 10 }}>
                  <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>

              </Form>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );

  }
}

node_setting = Form.create({})(node_setting)
export default node_setting;