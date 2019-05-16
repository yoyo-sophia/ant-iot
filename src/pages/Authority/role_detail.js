import react,{ Component } from 'react'
import { connect } from "dva/index";
import { Card } from 'antd'
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import StandardTable from "@/components/StandardTable";

@connect(({ authority, loading }) => ({
  authority,
  tableLoading: loading.effects["authority/fetch_role_partner_list"]
}))

class role_detail extends Component{
  state = {
    roleDetailInfo:JSON.parse(localStorage.getItem('rolePartnerDetail')),
    initialPagination: {
      current: 1,
      pageSize: 10,
    },
  };

  columns = [{
    title: "序号",
    dataIndex: "id"
  },{
    title: "账号名称",
    dataIndex: "name"
  }];

  componentDidMount(){
    const { dispatch } = this.props;
    const { roleDetailInfo, initialPagination } = this.state;
    dispatch({
      type:'authority/fetch_role_partner_list',
      payload:{
        authority_id: roleDetailInfo.id,
        offset: initialPagination.current,
        limit: initialPagination.pageSize,
      }
    });
  };

  render(){
    const { authority:{rolePartnerList}, tableLoading } = this.props;
    const { roleDetailInfo } = this.state;
    return(
      <PageHeaderWrapper title={`${roleDetailInfo.name}-代理商列表`}>
        <Card>
          <StandardTable
            selectedRows={[]}
            loading={tableLoading}
            data={rolePartnerList.data}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }

}

export default role_detail