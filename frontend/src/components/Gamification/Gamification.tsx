import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Progress, Badge, Tabs, Tag, Button, Typography, Divider } from 'antd';
import { 
  TrophyOutlined, 
  FireOutlined, 
  StarOutlined, 
  CrownOutlined, 
  TeamOutlined, 
  BarChartOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TrophyFilled,
  SyncOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { TabPane } = Tabs;

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress?: number;
  total?: number;
  unlockedAt?: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  reward: number;
  deadline?: string;
  completed: boolean;
  progress: number;
  total: number;
  category: 'daily' | 'weekly' | 'achievement';
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  change: number;
}

const Gamification: React.FC = () => {
  const userLevel = 12;
  const userPoints = 4750;
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock achievements data
      const mockAchievements: Achievement[] = [
        {
          id: 'ach-1',
          name: 'Policy Pioneer',
          description: 'Complete your first policy simulation',
          icon: <TrophyOutlined style={{ color: '#ffc53d' }} />,
          points: 100,
          unlocked: true,
          unlockedAt: '2025-10-15T14:30:00Z'
        },
        {
          id: 'ach-2',
          name: 'Data Explorer',
          description: 'View 10 different economic indicators',
          icon: <BarChartOutlined style={{ color: '#722ed1' }} />,
          points: 250,
          unlocked: true,
          progress: 8,
          total: 10,
          unlockedAt: '2025-10-20T09:15:00Z'
        },
        {
          id: 'ach-3',
          name: 'Economic Guru',
          description: 'Reach level 20',
          icon: <CrownOutlined style={{ color: '#ffc53d' }} />,
          points: 500,
          unlocked: false,
          progress: 12,
          total: 20
        },
        {
          id: 'ach-4',
          name: 'Community Champion',
          description: 'Earn 50 likes on your policy analyses',
          icon: <TeamOutlined style={{ color: '#13c2c2' }} />,
          points: 300,
          unlocked: false,
          progress: 23,
          total: 50
        }
      ];

      // Mock challenges data
      const mockChallenges: Challenge[] = [
        {
          id: 'ch-1',
          name: 'Daily Analysis',
          description: 'Run 3 policy simulations today',
          reward: 50,
          deadline: '2025-11-01T23:59:59Z',
          completed: false,
          progress: 1,
          total: 3,
          category: 'daily'
        },
        {
          id: 'ch-2',
          name: 'Weekly Explorer',
          description: 'Explore 5 different policy areas this week',
          reward: 150,
          deadline: '2025-11-05T23:59:59Z',
          completed: false,
          progress: 2,
          total: 5,
          category: 'weekly'
        },
        {
          id: 'ch-3',
          name: 'Master Strategist',
          description: 'Create a policy that achieves all targets',
          reward: 300,
          completed: false,
          progress: 0,
          total: 1,
          category: 'achievement'
        }
      ];

      // Mock leaderboard data
      const mockLeaderboard: LeaderboardUser[] = [
        { rank: 1, name: 'EconMaster', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', score: 12800, change: 2 },
        { rank: 2, name: 'PolicyWonk', avatar: 'https://randomuser.me/api/portraits/lego/2.jpg', score: 11200, change: -1 },
        { rank: 3, name: 'DataDriven', avatar: 'https://randomuser.me/api/portraits/lego/3.jpg', score: 9800, change: 5 },
        { rank: 4, name: 'EconNerd', avatar: 'https://randomuser.me/api/portraits/lego/4.jpg', score: 8750, change: 0 },
        { rank: 5, name: 'You', avatar: 'https://randomuser.me/api/portraits/lego/5.jpg', score: 4750, change: 3 },
        { rank: 6, name: 'FutureLeader', avatar: 'https://randomuser.me/api/portraits/lego/6.jpg', score: 4200, change: -2 },
        { rank: 7, name: 'PolicyGuru', avatar: 'https://randomuser.me/api/portraits/lego/7.jpg', score: 3800, change: 1 }
      ];

      setAchievements(mockAchievements);
      setChallenges(mockChallenges);
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getProgressColor = (progress: number, total: number) => {
    const percentage = (progress / total) * 100;
    if (percentage < 30) return '#ff4d4f';
    if (percentage < 70) return '#faad14';
    return '#52c41a';
  };

  // Removed unused getChangeIcon function

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrophyFilled style={{ color: '#ffc53d', fontSize: 20 }} />
            <span>My Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Level</Text>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>{userLevel}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Points</Text>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>{userPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>
      }
      bodyStyle={{ padding: 0 }}
      extra={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="text" 
            icon={<SyncOutlined />} 
            onClick={() => {
              setLoading(true);
              // Simulate data refresh
              setTimeout(() => {
                setLastUpdated(new Date());
                setLoading(false);
              }, 1000);
            }}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      }
    >
      <Tabs defaultActiveKey="challenges" style={{ marginTop: -16 }}>
        <TabPane 
          tab={
            <span>
              <FireOutlined />
              <span>Challenges</span>
            </span>
          } 
          key="challenges"
        >
          <List
            loading={loading}
            dataSource={challenges}
            renderItem={(challenge) => (
              <List.Item
                key={challenge.id}
                actions={[
                  <Button 
                    key="action"
                    type={challenge.completed ? 'default' : 'primary'} 
                    size="small"
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? 'Completed' : 'Start'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    challenge.category === 'daily' ? 
                      <FireOutlined style={{ fontSize: 24, color: '#ff4d4f' }} /> :
                    challenge.category === 'weekly' ?
                      <StarOutlined style={{ fontSize: 24, color: '#faad14' }} /> :
                      <TrophyOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{challenge.name}</span>
                      <Tag color={challenge.category === 'daily' ? 'red' : challenge.category === 'weekly' ? 'gold' : 'purple'}>
                        {challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div>{challenge.description}</div>
                      <div style={{ marginTop: 8 }}>
                        <Progress 
                          percent={(challenge.progress / challenge.total) * 100} 
                          size="small" 
                          showInfo={false}
                          strokeColor={getProgressColor(challenge.progress, challenge.total)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                          <span>{challenge.progress} / {challenge.total}</span>
                          <span>+{challenge.reward} pts</span>
                        </div>
                      </div>
                      {challenge.deadline && (
                        <div style={{ marginTop: 4, fontSize: 12, color: '#8c8c8c' }}>
                          <ClockCircleOutlined /> {new Date(challenge.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <StarOutlined />
              <span>Achievements</span>
              <Badge count={achievements.filter(a => !a.unlocked).length} style={{ marginLeft: 8 }} />
            </span>
          } 
          key="achievements"
        >
          <List
            loading={loading}
            dataSource={achievements}
            renderItem={(achievement) => (
              <List.Item
                key={achievement.id}
                style={{ opacity: achievement.unlocked ? 1 : 0.6 }}
                extra={
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 'bold', color: achievement.unlocked ? '#52c41a' : '#8c8c8c' }}>
                      +{achievement.points}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </Text>
                  </div>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Badge 
                      count={achievement.unlocked ? 
                        <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                        <span style={{ color: '#8c8c8c' }}>🔒</span>
                      }
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Avatar 
                        size="large" 
                        icon={achievement.icon} 
                        style={{ 
                          backgroundColor: achievement.unlocked ? '#f6ffed' : '#f5f5f5',
                          color: achievement.unlocked ? '#52c41a' : '#8c8c8c'
                        }} 
                      />
                    </Badge>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{achievement.name}</span>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <Tag color="green" style={{ fontSize: 10, padding: '0 4px' }}>
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Tag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <div>{achievement.description}</div>
                      {achievement.progress !== undefined && achievement.total !== undefined && (
                        <div style={{ marginTop: 8 }}>
                          <Progress 
                            percent={(achievement.progress / achievement.total) * 100} 
                            size="small" 
                            showInfo={false}
                            strokeColor={getProgressColor(achievement.progress, achievement.total)}
                          />
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {achievement.progress} of {achievement.total} complete
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CrownOutlined />
              <span>Leaderboard</span>
            </span>
          } 
          key="leaderboard"
        >
          <List
            loading={loading}
            dataSource={leaderboard}
            renderItem={(user) => (
              <List.Item
                key={user.rank}
                actions={[
                  <Button type="link" size="small" key="view">View Profile</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={user.rank} style={{ 
                      backgroundColor: user.rank <= 3 ? '#52c41a' : '#8c8c8c',
                      marginRight: 8
                    }}>
                      <Avatar size="large" src={user.avatar}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{user.name}</span>
                      <span style={{ 
                        color: user.change > 0 ? '#52c41a' : user.change < 0 ? '#ff4d4f' : '#8c8c8c',
                        fontSize: 12
                      }}>
                        {user.change > 0 ? '↑' : user.change < 0 ? '↓' : ''} {Math.abs(user.change)}
                      </span>
                      {user.rank <= 3 && (
                        <span style={{ fontSize: '1.2em' }}>
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  }
                  description={
                    <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                      <span>Level {Math.floor(user.score / 1000) + 1}</span>
                      <span>{(user.score % 1000).toLocaleString()} XP</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
      
      <Divider style={{ margin: '16px 0' }} />
      
      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      </div>
    </Card>
  );
};

export default Gamification;
