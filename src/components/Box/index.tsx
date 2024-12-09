// SPDX-FileCopyrightText: 2024 AFCMS <afcm.contact@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

import "./Box.css";

function Box(props: {
	t?: "edit" | "right" | "wrong" | "wplaced";
	letter: string;
}) {
	let case_type = "";

	switch (props.t) {
		case "edit":
			case_type = "case-b";
			break;
		case "right":
			case_type = "case-g";
			break;
		case "wrong":
			case_type = "case-e";
			break;
		case "wplaced":
			case_type = "case-y";
			break;
		default:
			break;
	}

	return <div className={"case " + case_type}>{props.letter}</div>;
}

export default Box;
