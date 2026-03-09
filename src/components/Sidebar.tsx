import { useAuth } from '../context/AuthContext';
import { Flex, Text, Button, Box, Avatar, IconButton } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    BarChart3, 
    Settings, 
    FileText, 
    CreditCard, 
    LifeBuoy,
    LogOut,
    X,
    Zap
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const adminLinks = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const clientLinks = [
        { label: 'Overview', path: '/client', icon: LayoutDashboard },
        { label: 'My Files', path: '/client/files', icon: FileText },
        { label: 'Billing', path: '/client/billing', icon: CreditCard },
        { label: 'Support', path: '/client/support', icon: LifeBuoy },
    ];

    const links = user?.role === 'admin' ? adminLinks : clientLinks;

    const handleLogout = () => {
        onClose();
        logout();
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 769) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
                onClick={onClose}
            />

            {/* Sidebar */}
            <Flex 
                direction="column" 
                className={`sidebar-mobile ${isOpen ? 'open' : ''}`}
                style={{ 
                    width: '260px', 
                    height: '100vh', 
                    background: 'linear-gradient(180deg, var(--gray-1) 0%, var(--gray-2) 100%)',
                    borderRight: '1px solid var(--gray-4)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 50,
                    flexShrink: 0
                }}
            >
                {/* Header */}
                <Flex align="center" justify="between" px="4" py="5">
                    <Flex align="center" gap="3">
                        <Box style={{ 
                            width: '36px', 
                            height: '36px', 
                            background: 'linear-gradient(135deg, var(--accent-9) 0%, var(--accent-10) 100%)',
                            borderRadius: '10px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 2px 8px var(--accent-a6)'
                        }}>
                            <Zap size={20} />
                        </Box>
                        <Box>
                            <Text size="3" weight="bold" as="div">Ready App</Text>
                            <Text size="1" color="gray" as="div">
                                {user?.role === 'admin' ? 'Admin' : 'Client'}
                            </Text>
                        </Box>
                    </Flex>
                    <IconButton 
                        variant="ghost" 
                        color="gray" 
                        className="hide-desktop"
                        onClick={onClose}
                        style={{ cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </IconButton>
                </Flex>

                {/* Navigation */}
                <Flex direction="column" gap="1" px="3" style={{ flex: 1 }}>
                    <Text size="1" weight="medium" color="gray" mb="2" ml="2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '11px' }}>
                        Navigation
                    </Text>
                    {links.map((link) => {
                        const active = isActive(link.path);
                        const Icon = link.icon;
                        
                        return (
                            <Link 
                                to={link.path} 
                                key={link.path} 
                                style={{ textDecoration: 'none' }}
                                onClick={handleLinkClick}
                            >
                                <Flex 
                                    align="center" 
                                    gap="3" 
                                    py="2"
                                    px="3"
                                    style={{ 
                                        borderRadius: '8px',
                                        backgroundColor: active ? 'var(--accent-a3)' : 'transparent',
                                        color: active ? 'var(--accent-11)' : 'var(--gray-11)',
                                        cursor: 'pointer',
                                        fontWeight: active ? 500 : 400
                                    }}
                                    className={active ? 'active' : 'sidebar-link'}
                                >
                                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                    <Text size="2">{link.label}</Text>
                                    {active && (
                                        <Box style={{ 
                                            marginLeft: 'auto', 
                                            width: '6px', 
                                            height: '6px', 
                                            borderRadius: '50%', 
                                            backgroundColor: 'var(--accent-9)' 
                                        }} />
                                    )}
                                </Flex>
                            </Link>
                        );
                    })}
                </Flex>

                {/* Footer */}
                <Box p="3" style={{ borderTop: '1px solid var(--gray-4)' }}>
                    <Flex 
                        align="center" 
                        gap="3" 
                        p="3"
                        mb="2"
                        style={{ 
                            borderRadius: '10px', 
                            backgroundColor: 'var(--gray-3)'
                        }}
                    >
                        <Avatar
                            size="2"
                            fallback={user?.username?.[0]?.toUpperCase() || 'U'}
                            variant="solid"
                            color="iris"
                        />
                        <Box style={{ overflow: 'hidden', flex: 1 }}>
                            <Text size="2" weight="medium" as="div" style={{ 
                                whiteSpace: 'nowrap', 
                                textOverflow: 'ellipsis', 
                                overflow: 'hidden' 
                            }}>
                                {user?.username}
                            </Text>
                            <Text size="1" color="gray" as="div" style={{ 
                                whiteSpace: 'nowrap', 
                                textOverflow: 'ellipsis', 
                                overflow: 'hidden' 
                            }}>
                                {user?.email}
                            </Text>
                        </Box>
                    </Flex>
                    
                    <Button 
                        variant="soft" 
                        color="gray" 
                        onClick={handleLogout} 
                        style={{ 
                            width: '100%', 
                            justifyContent: 'center', 
                            gap: '8px', 
                            cursor: 'pointer' 
                        }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </Button>
                </Box>
            </Flex>
        </>
    );
};

export default Sidebar;
