import React, { Component } from "react";
import dva from "dva";
import { Input, Select, Card } from "antd";
import { connect } from "dva/index";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";

@connect(({ authority, loading }) => ({
  authority,
  loading: loading.models.authority
}))

class account_detail extends Component {

  state = {
    selectedRows:[],
  };

  columns = [{
    title: "序号",
    dataIndex: "id"
  }, {
    title: "账号",
    dataIndex: "name"
  },
    {
      title: "拥有权限",
      dataIndex: "authorities"
    }];

  componentDidMount() {
    const { dispatch } = this.props;
    let detail_id = localStorage.getItem('accountAuthorityDetail');
    dispatch({
      type:'authority/fetch_account_detail',
      payload:{
        id:detail_id
      }
    })
  };

  render() {
    const { authority:{accountDetailData}, loading } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="账号权限详情">
        <Card>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={accountDetailData}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    );

  }

}

export default account_detail;
