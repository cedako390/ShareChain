import {
	ChevronDownIcon,
	HomeIcon,
	Squares2X2Icon,
} from "@heroicons/react/16/solid";
import { Avatar, Menu, Text } from "@mantine/core";
import { useLocation } from "@tanstack/react-router";
import styles from "./Header.module.scss";

const urls = [
	{ name: "Home", icon: HomeIcon, pathname: "/" },
	{ name: "Workspace", icon: Squares2X2Icon, pathname: "/workspace" },
];

const user = {
	fullName: "Амммм Ббббб",
};

function shortenName(fullName: string): string {
	const parts = fullName.trim().split(" ");
	if (parts.length < 2) return fullName;
	const [firstName, lastName] = parts;
	return `${firstName} ${lastName[0]}.`;
}

function Header() {
	const location = useLocation();
	const current = urls.find((x) => x.pathname === location.pathname);

	return (
		<div className={styles.header}>
			<div className={styles.url}>
				<div className={styles["url-icon"]}>
					{current ? <current.icon /> : null}
				</div>
				{current ? current.name : "Unknown"}
			</div>

			<Menu shadow="md" width={200}>
				<Menu.Target>
					<div className={styles.user}>
						<Avatar
							size={30}
							key={user.fullName}
							name={user.fullName}
							color="initials"
						/>
						{shortenName(user.fullName)}
						<div className={styles["user-icon"]}>
							<ChevronDownIcon />
						</div>
					</div>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Application</Menu.Label>
					<Menu.Item leftSection={<Squares2X2Icon />}>Settings</Menu.Item>
					<Menu.Item leftSection={<Squares2X2Icon />}>Messages</Menu.Item>
					<Menu.Item leftSection={<Squares2X2Icon />}>Gallery</Menu.Item>
					<Menu.Item
						leftSection={<Squares2X2Icon />}
						rightSection={
							<Text size="xs" c="dimmed">
								⌘K
							</Text>
						}
					>
						Search
					</Menu.Item>

					<Menu.Divider />

					<Menu.Label>Danger zone</Menu.Label>
					<Menu.Item leftSection={<Squares2X2Icon />}>
						Transfer my data
					</Menu.Item>
					<Menu.Item color="red" leftSection={<Squares2X2Icon />}>
						Delete my account
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
}

export { Header };
