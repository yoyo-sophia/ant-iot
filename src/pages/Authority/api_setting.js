import React, { Component } from "react";
import { connect } from "dva";
import { Card, Row, Col, Tree, Select ,Button,message} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import style from "./css/node-setting.less";
import StandardTable from "@/components/StandardTable";

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
const Option = Select.Option;


@connect(({ menu, authority, loading }) => ({
  menuData: menu.menuData,
  authority,
  selectLoading: loading.effects["authority/get_api_list"],
  tableLoading: loading.effects['authority/get_menu_cur_api']
}))

class api_setting extends Component {

  state = {
    menu_id:'', // 当前选中的menu_id
    cur_select_api_id: '', // 当前选中的接口id
    newMenuList: [], // 扁平化及诶单数据
    curSelectKey:[],//当前选中节点数据
  };

  columns=[{
    title: "序号",
    dataIndex: "rule_id"
  },{
    title: "菜单路由ID",
    dataIndex: "menu_rule_id"
  },{
    title: "接口名称",
    dataIndex: "name"
  },{
    title:"接口路径",
    dataIndex:"path"
  },{
    title:"操作",
    render: (text, record) => (
      <Button type="primary" onClick={ ()=>this.deleteApiFromNode(record) }>移除</Button>
    )
  }];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "authority/get_api_list"
    });
  };

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
          disabled={item.is_top===1 ? true : false}
          title={item.name}
          key={item.menu_id}>
          {this.getNavMenuItems(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      disabled={item.is_top === 1 ? true : false}
      title={item.name}
      key={item.menu_id}
      isLeaf/>;
  };

  // 扁平化菜单数据
  getItem = (data) => {
    data.map(item => {
      if (!item.children) {
        this.state.newMenuList.push(item);
      } else {
        this.state.newMenuList.push(item);
        this.getItem(item.children);
      }
    });
  };

  onSelect = (selectedKeys) => {
    const { dispatch } = this.props;

    let choose_menu_data = {};
    this.state.newMenuList
      .map(item => {
        if (selectedKeys[0] == item.menu_id) {
          choose_menu_data = item;
        }
      });
    this.setState({
      menu_id:choose_menu_data.menu_id,
      curSelectKey: selectedKeys,
    });

    if(choose_menu_data.menu_id){
      dispatch({
        type:'authority/get_menu_cur_api',
        payload:{
          menu_id:choose_menu_data.menu_id,
        }
      });
    };

  };

  // select 相关操作
  renderSelect= (data) => {
    const {selectLoading} = this.props;
    if (data.length) {
      return(
        <Select
          showSearch
          style={{ width: 200 }}
          loading={selectLoading}
          onChange={this.onChange}
          onSearch={this.onSearch}
          placeholder="请选择需要接口名称"
        >
          {
            data.map((item,index)=>{
              return  <Option key={index} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      )
    } else {
      return (
        <Select
          style={{ width: 200 }}
        >
          <Option value={-1}>暂无数据</Option>
        </Select>
      );
    }
  };

  onChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      cur_select_api_id:value,
    })

  };

  onSearch = (val) => {
    // console.log("search:", val);
  };

  /*
  * 接口相关操作
  * */

  // 给菜单新增接口
  addApiToNode = () =>{
    const { dispatch, authority: { apiList } }  = this.props;
    const { menu_id, cur_select_api_id } = this.state;

    if(!menu_id){
      message.error('请选择需要添加接口的节点');
      return
    };
    if(cur_select_api_id === -1){
      message.error('当前接口列表暂无数据');
      return
    };
    if(apiList.data.length && !cur_select_api_id){
      message.error('请选择需要新增的接口数据');
      return
    }
    new Promise(resolve => {
      dispatch({
        type:'authority/dispatch_api_to_menu',
        payload:{
          params:{
            menu_id:menu_id,
            rule_id:cur_select_api_id,
          },
          resolve
        },
      })
    }).then(res=>{
      if(res.state === 1){
        message.success('分配接口成功');
        // 刷新表格
        dispatch({
          type:'authority/get_menu_cur_api',
          payload:{
            menu_id:menu_id,
          }
        });
      }else {
        message.error(res.msg)
      }
    })
  };

  // 移除菜案接口
  deleteApiFromNode = (rowInfo) =>{
    const { dispatch }  = this.props;
    const { menu_id } = this.state;
    new Promise(resolve=>{
      dispatch({
        type:'authority/delete_menu_api',
        payload:{
          params:{
            menu_rule_id:rowInfo.menu_rule_id
          },
          resolve
        }
      });
    }).then(res=>{
      // 刷新表格
      if(res.state === 1){
        message.success('移除接口成功');
        dispatch({
          type:'authority/get_menu_cur_api',
          payload:{
            menu_id:menu_id,
          }
        });
      }else{
        message.error(res.msg);
      };
    });

  };

  render() {
    const { menuData, authority: { apiList, nodeApiList }, selectLoading ,tableLoading} = this.props;
    const { curSelectKey } = this.state;

    // 将嵌套菜单数据扁平化
    this.getItem(menuData);

    return (
      <PageHeaderWrapper title="接口设置">
        <Card bordered={false} className={`${style["node-setting"]} ${style["api-setting"]}`}>
          <Row gutter={24}>
            <Col span={8}>
              <div className={style["tree-node-wrap"]}>
                <p className={style.title}>节点列表</p>
              </div>
              <DirectoryTree
                onSelect={this.onSelect}
                selectedKeys={curSelectKey}
                switcherIcon=''
              >
                {this.getNavMenuItems(menuData)}
              </DirectoryTree>
            </Col>
            <Col span={16}>
              <div>
                <span>接口配置：</span>
                {this.renderSelect(apiList.data)}
                <Button className={style.btnAddApi} onClick={this.addApiToNode} type="primary">添加</Button>
              </div>

              <StandardTable
                selectedRows={[]}
                loading={tableLoading}
                data={nodeApiList.data}
                columns={this.columns}
              />

            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default api_setting;