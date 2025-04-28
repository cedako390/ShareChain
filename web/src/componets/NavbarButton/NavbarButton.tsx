import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import classes from "./NavbarButton.module.scss";

interface NavbarButtonProps {
	icon: ReactNode;
	label: string;
	to?: string;
	active?: boolean;
	onClick?: () => void;
}

export function NavbarButton({
	icon,
	label,
	to = "",
	active = false,
	onClick,
}: NavbarButtonProps) {
	return (
		<Link
			onClick={onClick}
			to={to}
			className={`${classes.link} ${active ? classes.active : ""}`}
		>
			<div className={`${classes.icon} ${active ? classes.iconActive : ""}`}>
				{icon}
			</div>
			<span className={classes.label}>{label}</span>
		</Link>
	);
}
