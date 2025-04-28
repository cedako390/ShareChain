import { createFileRoute } from '@tanstack/react-router'
import {Button, Card, Center, Input, PasswordInput, Title} from "@mantine/core";
import styles from './login.module.scss'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Center h={'80vh'}>
    <Card padding={'lg'} radius="md" shadow={'xs'} withBorder className={styles.main}>
      <Title order={3}>Вход</Title>
      <Input placeholder="login" size={"xs"} />
      <PasswordInput placeholder="password" size={"xs"} />
      <Button color="blue" fullWidth mt="md" radius="md">
        Войти в аккаунт
      </Button>
    </Card>
  </Center>
}
