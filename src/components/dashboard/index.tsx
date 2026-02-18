import { Container, Row } from 'reactstrap'
import { queries } from '../../api'
import LocationsWiseUsers from './LocationsWiseUsers'
import MessageActivity from './MessageActivity'
import MessageDistribution from './MessageDistribution'
import MonthlyUsersGrowth from './MonthlyUsersGrowth'
import RecentGroups from './RecentGroups'
import RecentUserRegistrations from './RecentUserRegistrations'
import ReportTypes from './ReportTypes'
import TodayHourlyActivity from './TodayHourlyActivity'
import WelcomeCard from './WelcomeCard'
import WidgetCard from './WidgetCard'

const Dashboard = () => {
  const { data } = queries.useGetDashboard()
  return (
    <Container fluid>
      <div className="default-dashboard">
        <Row>
          <WelcomeCard />
          <WidgetCard data={data?.data.counts} />
          <MessageActivity data={data?.data.charts.messageActivityStats} />
          <RecentUserRegistrations />
          <ReportTypes data={data?.data.charts.reportTypeStats} />
          <MessageDistribution data={data?.data.charts.messageTypeStats} />
          <LocationsWiseUsers data={data?.data.charts.userLocationDistribution} />
          <RecentGroups />
          <MonthlyUsersGrowth data={data?.data.charts.userGrowthMonthly} />
          <TodayHourlyActivity data={data?.data.charts.messagesByHour} />
        </Row>
      </div>
    </Container>
  )
}
export default Dashboard
