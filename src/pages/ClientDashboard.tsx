import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, Heading, Button, Card, Grid, Text, Badge, Box, Progress } from '@radix-ui/themes';
import DashboardLayout from '../components/DashboardLayout';
import { Crown, MessageSquare, Gauge, FileText, Download } from 'lucide-react';

const ClientDashboard = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'client')) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" style={{ height: '100vh' }}>
                <Box className="spinner" style={{ width: 24, height: 24, border: '2px solid var(--gray-4)', borderTopColor: 'var(--accent-9)', borderRadius: '50%' }} />
            </Flex>
        );
    }

    const files = [
        { name: 'Project_Alpha_v2.pdf', size: '2.4 MB', date: 'Today' },
        { name: 'Invoice_#1024.pdf', size: '156 KB', date: 'Yesterday' },
        { name: 'Design_Assets.zip', size: '45 MB', date: 'Mar 5' },
    ];

    return (
        <DashboardLayout>
            <Box>
                <Box mb="6">
                    <Heading size={{ initial: '6', sm: '7' }} mb="1">Welcome back, {user?.username}!</Heading>
                    <Text size="2" color="gray">Here is what's happening today.</Text>
                </Box>

                <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4" mb="6">
                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="2">
                                <Text size="2" color="gray">Current Plan</Text>
                                <Heading size="5">Pro</Heading>
                                <Badge color="green" size="1">Active</Badge>
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--amber-a3)', borderRadius: '10px' }}>
                                <Crown size={20} color="var(--amber-9)" />
                            </Box>
                        </Flex>
                    </Card>
                    
                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="2">
                                <Text size="2" color="gray">Messages</Text>
                                <Heading size="5">3 Unread</Heading>
                                <Text size="1" color="blue">View inbox</Text>
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--blue-a3)', borderRadius: '10px' }}>
                                <MessageSquare size={20} color="var(--blue-9)" />
                            </Box>
                        </Flex>
                    </Card>

                    <Card className="hover-card" style={{ backgroundColor: 'white' }}>
                        <Flex justify="between" align="start">
                            <Flex direction="column" gap="2" style={{ flex: 1 }}>
                                <Text size="2" color="gray">Storage Used</Text>
                                <Heading size="5">85%</Heading>
                                <Progress value={85} color="orange" size="1" style={{ marginTop: 4 }} />
                            </Flex>
                            <Box p="2" style={{ backgroundColor: 'var(--orange-a3)', borderRadius: '10px' }}>
                                <Gauge size={20} color="var(--orange-9)" />
                            </Box>
                        </Flex>
                    </Card>
                </Grid>

                <Card style={{ backgroundColor: 'white' }}>
                    <Flex justify="between" align="center" mb="4">
                        <Flex align="center" gap="2">
                            <FileText size={18} color="var(--gray-11)" />
                            <Heading size="4">Recent Files</Heading>
                        </Flex>
                        <Button variant="ghost" size="1" style={{ cursor: 'pointer' }}>View All</Button>
                    </Flex>
                    
                    <Box style={{ overflowX: 'auto' }}>
                        <Flex direction="column" gap="0">
                            {files.map((file, i) => (
                                <Flex 
                                    key={i} 
                                    justify="between" 
                                    align="center" 
                                    py="3"
                                    px="2"
                                    style={{ 
                                        borderBottom: i < files.length - 1 ? '1px solid var(--gray-4)' : 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                    className="sidebar-link"
                                >
                                    <Flex align="center" gap="3" style={{ minWidth: 0 }}>
                                        <Box p="2" style={{ backgroundColor: 'var(--gray-3)', borderRadius: '8px', flexShrink: 0 }}>
                                            <FileText size={16} color="var(--gray-9)" />
                                        </Box>
                                        <Box style={{ minWidth: 0 }}>
                                            <Text size="2" weight="medium" as="div" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {file.name}
                                            </Text>
                                            <Text size="1" color="gray">{file.size} • {file.date}</Text>
                                        </Box>
                                    </Flex>
                                    <Button size="1" variant="ghost" style={{ cursor: 'pointer', flexShrink: 0 }}>
                                        <Download size={14} />
                                    </Button>
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                </Card>
            </Box>
        </DashboardLayout>
    );
};

export default ClientDashboard;

