import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';
import {useAuth} from "../../context/AuthContext.jsx";

export function UserButton() {
    const { user} = useAuth();
    return (
        <UnstyledButton className={classes.user}>
            <Group gap="sm" justify="space-between">
                <Group gap="sm">
                    <Avatar
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png"
                        radius="xl"
                        size="md"
                    />
                    <div className={classes.userInfo}>
                        <Text size="sm" className={classes.name}>
                            {user.name}
                        </Text>
                        <Text c="dimmed" size="xs" className={classes.email}>
                            @{user.username}
                        </Text>
                    </div>
                </Group>
                <IconChevronRight size={16} stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
}
