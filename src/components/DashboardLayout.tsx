import { useState, useCallback, type ReactNode } from 'react';
import { Box, Flex, IconButton, Text } from '@radix-ui/themes';
import { Menu, Zap } from 'lucide-react';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <Flex style={{ minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
            {/* Desktop Sidebar placeholder for layout */}
            <Box className="hide-mobile" style={{ width: '260px', flexShrink: 0 }} />
            
            {/* Sidebar Component */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            
            {/* Main Content */}
            <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
                {/* Mobile Header */}
                <Flex 
                    className="hide-desktop"
                    align="center" 
                    justify="between"
                    px="4" 
                    py="3"
                    style={{ 
                        backgroundColor: 'white', 
                        borderBottom: '1px solid var(--gray-4)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 30
                    }}
                >
                    <Flex align="center" gap="3">
                        <IconButton 
                            variant="ghost" 
                            color="gray" 
                            onClick={openSidebar}
                            style={{ cursor: 'pointer' }}
                        >
                            <Menu size={20} />
                        </IconButton>
                        <Flex align="center" gap="2">
                            <Box style={{ 
                                width: '28px', 
                                height: '28px', 
                                background: 'linear-gradient(135deg, var(--accent-9) 0%, var(--accent-10) 100%)',
                                borderRadius: '6px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Zap size={14} />
                            </Box>
                            <Text size="3" weight="bold">Ready App</Text>
                        </Flex>
                    </Flex>
                </Flex>

                {/* Page Content */}
                <Box 
                    p={{ initial: '4', sm: '6' }} 
                    style={{ flex: 1 }}
                >
                    <Box style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Box mb="4" className="hide-mobile">
                            <Breadcrumbs />
                        </Box>
                        {children}
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default DashboardLayout;
